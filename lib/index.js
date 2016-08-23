"use strict";
var utils = require("gator-utils");
var _client = require('./client');
var _errors = require('./errors');
var _applications = require('./admin/applications');
var _users = require('./admin/users');
var _accounts = require('./admin/accounts');
var _projects = require('./admin/projects');
var _reporting = require('./reporting');
var settings = utils.config.settings();
exports.client = _client;
exports.errors = _errors;
exports.users = _users;
exports.accounts = _accounts;
exports.applications = _applications;
exports.projects = _projects;
exports.reporting = _reporting;
exports.logs = require('./admin/logs');
exports.login = require('./admin/login');
exports.signup = require('./admin/signup');
exports.sessions = require('./admin/sessions');
exports.REST = require('./REST');
var Authorization = (function () {
    function Authorization() {
    }
    return Authorization;
}());
exports.Authorization = Authorization;
function log(a1, a2, a3, a4, a5) {
    exports.logs.log(a1, a2, a3, a4, a5);
}
exports.log = log;
function authorize(params, callback) {
    try {
        exports.client.post('/v1/authorize', params, function (err, req, res, result) {
            if (err)
                callback(err);
            else if (!result)
                callback(new exports.errors.APIError());
            else
                callback(null, result.data);
        });
    }
    catch (err) {
        callback(err);
    }
}
exports.authorize = authorize;
function authenticate(req, res, next) {
    var accessToken, noRedirect = req['noRedirect'];
    delete req['noRedirect'];
    if (req.query && req.query.accessToken) {
        accessToken = req.query.accessToken;
        setSessionCookie(res, accessToken);
    }
    else if (req.signedCookies['accessToken'])
        accessToken = req.signedCookies['accessToken'];
    if (accessToken) {
        req.session = exports.sessions.get(accessToken);
        if (!req.session) {
            var authParams = {
                accessToken: accessToken,
                noCache: true
            };
            if (settings.hasOwnProperty('appId'))
                authParams['appId'] = +settings.appId;
            authorize(authParams, function (err, authObject) {
                if (!err && authObject) {
                    exports.sessions.set(authObject);
                    req.session = authObject;
                    return next();
                }
                else {
                    req.session = null;
                    if (!noRedirect)
                        res.redirect('/login');
                    else
                        return next();
                }
            });
        }
        else {
            return next();
        }
    }
    else {
        req.session = null;
        if (!noRedirect)
            res.redirect('/login');
        else
            return next();
    }
}
exports.authenticate = authenticate;
function authenticateNoRedirect(req, res, next) {
    req['noRedirect'] = true;
    return authenticate(req, res, next);
}
exports.authenticateNoRedirect = authenticateNoRedirect;
function logout(res) {
    res.clearCookie('accessToken');
    res.redirect('/login');
}
exports.logout = logout;
function setSessionCookie(res, accessToken) {
    if (utils.config.dev())
        res.cookie('accessToken', accessToken, { signed: true });
    else
        res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, signed: true });
}
exports.setSessionCookie = setSessionCookie;
function machineId() {
    try {
        var nis = require("os").networkInterfaces();
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
        return require("os").hostname();
    }
    catch (err) {
        return require("os").hostname();
    }
}
exports.machineId = machineId;
function getProject(req, id) {
    if (!req || !req['session'])
        return null;
    var ret, projects = req['session'].projects;
    if (projects && id) {
        projects.forEach(function (item) {
            if (item.id == +id)
                ret = item;
        });
    }
    return ret || null;
}
exports.getProject = getProject;
function currentProject(req) {
    if (!req || !req['session'])
        return null;
    var ret, projects = req['session'].projects, id = req['session'].currentProjectId;
    if (projects && id) {
        projects.forEach(function (item) {
            if (item.id == +id)
                ret = item;
        });
    }
    if (!ret && req['session'].projects && req['session'].projects.length > 0)
        ret = req['session'].projects[0];
    return ret || null;
}
exports.currentProject = currentProject;
function isSysAdmin(req) {
    return hasAdminPermission(req, 'admin');
}
exports.isSysAdmin = isSysAdmin;
function hasAdminPermission(req, permission) {
    try {
        if (!req || !req.session || !req.session.user || !req.session.user.permissions)
            return false;
        var user = req.session.user;
        if (user.appId != 1)
            return false;
        for (var p = 0; p < user.permissions.length; p++) {
            if (user.permissions[p] == 'admin' || user.permissions[p] == permission)
                return true;
        }
        return false;
    }
    catch (err) {
        return false;
    }
}
exports.hasAdminPermission = hasAdminPermission;
//# sourceMappingURL=index.js.map