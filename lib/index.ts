/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/restify/restify.d.ts" />
/// <reference path="../typings/gator-utils/gator-utils.d.ts" />
import utils = require("gator-utils");

import restify = require('restify');
import _client = require('./client');
import _errors = require('./errors');
import _modules = require('./admin/modules');
import _users = require('./admin/users');
import _accounts = require('./admin/accounts');
import _roles = require('./admin/roles');
import _projects = require('./admin/projects');

import _REST = require('./REST');

var settings = utils.config.settings();

export var client: restify.Client = _client;
export var errors = _errors;
export var roles = _roles;
export var users = _users;
export var accounts = _accounts;
export var modules = _modules;
export var projects = _projects;
export var logs = require('./admin/logs');
export var login = require('./admin/login');
export var signup = require('./admin/signup');
export var sessions = require('./admin/sessions');

export var REST = require('./REST');

export class Authorization {
    accessToken: string;
    user: _users.User;
    expiration: Date;
    account: _accounts.Account;
    projects: Array<_projects.Project>;
    currentProjectId: number;
}

export function log(a1, a2, a3, a4, a5) {
    logs.log(a1, a2, a3, a4, a5);
}

/*
 Authorize an access token and return user data.
 */
export function authorize(params: any, callback: (err?: _errors.APIError, result?: Authorization) => void) {

    try {

        client.post('/v1/authorize', params, function(err, req: restify.Request, res: restify.Response, result: any) {

            if (err)                                //  first, check for an exception
                callback(err);
            else if (!result)                       //  then check for a missing result
                callback(new errors.APIError());
            else
                callback(null, result.data);        //  finally, return the payload
        });
    } catch(err) {
        callback(err);
    }
}

export function hasPermission(accessToken: string, moduleId: number, permission: string | number, callback: (err?: _errors.APIError, result?: boolean) => void) {

    modules.getAll(function(err: _errors.APIError, mods: Array<_modules.Module>) {

        if (err)
            callback(err);
        else {

            authorize(accessToken, function(err?: _errors.APIError, authorization?: Authorization) {

                if (err)
                    callback(err);
                else if (!authorization || !authorization.user || !authorization.user.roles)
                    callback(null, false);
                else {

                    for (var r = 0; r < authorization.user.roles.length; r++) {

                        for (var p = 0; p < authorization.user.roles[r].permissions.length; p++) {

                            if (authorization.user.roles[r].moduleId == moduleId) {

                                if (typeof permission == 'string') {

                                    if (authorization.user.roles[r].permissions[p].name == permission) {
                                        callback(null, true);
                                        return;
                                    }
                                } else {

                                    if (authorization.user.roles[r].permissions[p].id == permission) {
                                        callback(null, true);
                                        return;
                                    }
                                }
                            }
                        }
                    }

                    callback(null, false);
                }
            });
        }
    });
}

export function resetPassword(accessToken: string, password:string, callback: (err?: _errors.APIError, result?: any) => void) {
    try{

        var params = { "password": password };

        client.post('/v1/users/resetpassword/' + accessToken, params, function(err, req: restify.Request, res: restify.Response, result: any) {

            if (err)                                //  first, check for an exception
                callback(err);
            else if (!result)                       //  then check for a missing result
                callback(new errors.APIError());
            else
                callback(null, result);        //  finally, return the payload
        });
    } catch(err) {
        callback(err);
    }
}

export function authenticate(req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler
    // The session adds this method to request object. A middleware is allowed to add properties to
    // request and response objects
    var accessToken, noRedirect = req['noRedirect'];
    delete req['noRedirect'];

    //  look for an access token override on the query string
    if (req.query && req.query.accessToken) {
        accessToken = req.query.accessToken;
        setSessionCookie(res, accessToken);
    } else if (req.signedCookies['accessToken'])
        accessToken = req.signedCookies['accessToken'];

    if (accessToken) {

        req.session = sessions.get(accessToken);

        //  if the session doesn't exist, try to authorize the token, since the server may have been rebooted
        if (!req.session) {

            var authParams = {
                accessToken: accessToken,
                noCache: true
            };

            if (settings.hasOwnProperty('moduleId'))
                authParams['moduleId'] = +settings.moduleId;

            authorize(authParams, function(err, authObject) {

                if (!err && authObject) {
                    sessions.set(authObject);
                    req.session = authObject;
                    return next();
                } else {
                    req.session = null;

                    if (!req['noRedirect'])
                        res.redirect('/login');
                    else
                        return next();
                }
            });
        } else {
            return next();
        }
    } else {
        req.session = null;

        if (!req['noRedirect'])
            res.redirect('/login');
        else
            return next();
    }
}

export function authenticateNoRedirect(req, res, next) {
    req['noRedirect'] = true;
    return authenticate(req, res, next);
}

export function logout(res) {
    res.clearCookie('accessToken');
    res.redirect('/login');
}

//  set the session cookie securely for live sessions
export function setSessionCookie(res, accessToken: string) {

    if (utils.config.dev())
        res.cookie('accessToken', accessToken, { signed: true });
    else
        res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, signed: true });
}

//  Generates unique machine id.  This is used for signing cookies.
export function machineId(): string {

    try {

        var nis = require("os").networkInterfaces();

        //  if no network interfaces, return hostname
        if (!nis)
            return require("os").hostname();

        for (var iface in nis) {

            if (nis.hasOwnProperty(iface)) {

                if (utils.isArray(nis[iface])) {

                    for (var i = 0; i < nis[iface].length; i++) {

                        if (nis[iface][i].mac && nis[iface][i].mac != '00:00:00:00:00:00') {
                            return nis[iface][i].mac;
                        }
                    }
                }
            }
        }

        //  if can't find a mac address, fall back to the hostname
        return require("os").hostname();
    } catch(err) {

        //  on an error, fallback to hostname
        return require("os").hostname();
    }
}

//  Get dashboards for current project - dashboards are project/user scope
export function currentDashboards(req) {
    var project = currentProject(req);
    var userId = req['session'].user.id;

    project.data = project.data || {};
    project.data[userId] = project.data[userId] || {};
    project.data[userId].dashboards = project.data[userId].dashboards || {};

    return project.data[userId].dashboards;
}

//  Get bookmarks for current project - bookmarks are project/user scope
export function currentBookmarks(req) {
    var project = currentProject(req);
    var userId = req['session'].user.id;

    project.data = project.data || {};
    project.data[userId] = project.data[userId] || {};
    project.data[userId].bookmarks = project.data[userId].bookmarks || {};

    return project.data[userId].bookmarks;
}

//  Get attributes for a project - custom attributes are project scope
export function getCustomAttributes(req, projectId) {
    var project = getProject(req, projectId);

    project.data = project.data || {};
    project.data.attributes = project.data.attributes || {};
    return project.data.attributes;
}

//  Return a project object based on an id
export function getProject(req, id) {

    if (!req || !req['session'])
        return null;

    var ret, projects = req['session'].projects;

    if (projects && id) {

        projects.forEach(function(item) {
            if (item.id == +id)
                ret = item;
        });
    }

    return ret || null;
}

//  Return the current active project's object or NULL if one is not selected
export function currentProject(req) {

    if (!req || !req['session'])
        return null;

    var ret, projects = req['session'].projects, id = req['session'].currentProjectId;

    if (projects && id) {

        projects.forEach(function(item) {
            if (item.id == +id)
                ret = item;
        });
    }

    return ret || null;
}
