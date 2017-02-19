/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/restify/restify.d.ts" />
/// <reference path="../typings/gator-utils/gator-utils.d.ts" />
import utils = require("gator-utils");

import restify = require('restify');
import _client = require('./client');
import _errors = require('./errors');
import _applications = require('./admin/applications');
import _users = require('./admin/users');
import _accounts = require('./admin/accounts');
import _projects = require('./admin/projects');
import _reporting = require('./reporting');

import _REST = require('./REST');

let settings = utils.config.settings();

export let client: restify.Client = _client;
export let errors = _errors;
export let users = _users;
export let accounts = _accounts;
export let applications = _applications;
export let projects = _projects;
export let reporting = _reporting;

export let logs = require('./admin/logs');
export let login = require('./admin/login');
export let signup = require('./admin/signup');
export let sessions = require('./admin/sessions');


export let REST = require('./REST');

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

export function authenticate(req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler
    // The session adds this method to request object. A middleware is allowed to add properties to
    // request and response objects
    let accessToken, noRedirect = req['noRedirect'], reauthenticate = req['reauthenticate'];
    delete req['noRedirect'];
    delete req['reauthenticate'];

    //  look for an access token override on the query string
    if (req.query && req.query.accessToken) {
        accessToken = req.query.accessToken;
        setSessionCookie(res, accessToken);
    } else if (req.signedCookies['accessToken'])
        accessToken = req.signedCookies['accessToken'];

    if (accessToken) {

        req.session = sessions.get(accessToken);

        //  if the session doesn't exist, try to authorize the token, since the server may have been rebooted
        if (!req.session || reauthenticate) {

            let authParams = {
                accessToken: accessToken,
                noCache: true
            };

            if (settings.hasOwnProperty('appId'))
                authParams['appId'] = +settings.appId;

            authorize(authParams, function(err, authObject) {

                if (!err && authObject) {
                    sessions.set(authObject);
                    req.session = authObject;
                    return next();
                } else {
                    req.session = null;

                    if (!noRedirect)
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

        if (!noRedirect)
            res.redirect('/login');
        else
            return next();
    }
}

export function authenticateNoRedirect(req, res, next) {
    req['noRedirect'] = true;
    return authenticate(req, res, next);
}

//  authenticate but not from cache
export function reauthenticate(req, res, next) {
    req['reauthenticate'] = true;
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

        let nis = require("os").networkInterfaces();

        //  if no network interfaces, return hostname
        if (!nis)
            return require("os").hostname();

        for (let iface in nis) {

            if (nis.hasOwnProperty(iface)) {

                if (utils.isArray(nis[iface])) {

                    for (let i = 0; i < nis[iface].length; i++) {

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

//  Return a project object based on an id
export function     getProject(req, id) {

    if (!req || !req['session'])
        return null;

    let ret, projects = req['session'].projects;

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

    let ret, projects = req['session'].projects, id = req['session'].currentProjectId;

    if (projects && id) {

        projects.forEach(function(item) {
            if (item.id == +id)
                ret = item;
        });
    }

    if (!ret && req['session'].projects && req['session'].projects.length > 0)
        ret = req['session'].projects[0];
    
    return ret || null;
}

//  Check that an auth has a specific permission for an app - this applies mainly to ops and admin functions
export function isSysAdmin(req): boolean {
    return hasAdminPermission(req, 'admin');
}

//  Check that an auth has a specific permission for an app - this applies mainly to ops and admin functions
export function hasAdminPermission(req, permission: string): boolean {

    try {

        //  A permission is granted if:
        //  1)  The user has been assigned admin permission
        //  2)  The user has been assigned the specific permission
        if (!req || !req.session || !req.session.user || !req.session.user.permissions)
            return false;

        let user = req.session.user;

        if (user.appId != 1)
            return false;
        
        for (let p = 0; p < user.permissions.length; p++) {

            //  Check for a specific permission - for admin checks DO NOT check for owner status
            if (user.permissions[p] == 'admin' || user.permissions[p] == permission)
                return true;
        }

        return false;
    } catch (err) {
         return false;
    }
}