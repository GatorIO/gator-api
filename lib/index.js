"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils = require("gator-utils");
const _client = require("./client");
const _errors = require("./errors");
const _applications = require("./admin/applications");
const _users = require("./admin/users");
const _accounts = require("./admin/accounts");
const _projects = require("./admin/projects");
const _reporting = require("./reporting");
let settings = utils.config.settings();
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
class Authorization {
}
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
    let accessToken, noRedirect = req['noRedirect'], reauthenticate = req['reauthenticate'];
    delete req['noRedirect'];
    delete req['reauthenticate'];
    if ((req.query && req.query.accessToken) || (reauthenticate && req.session && req.session.auth)) {
        if (req.query && req.query.accessToken)
            accessToken = req.query.accessToken;
        else
            accessToken = req.session.auth.accessToken;
        let authParams = {
            accessToken: accessToken,
            noCache: true
        };
        if (settings.hasOwnProperty('appId'))
            authParams['appId'] = +settings.appId;
        authorize(authParams, function (err, authObject) {
            if (!err && authObject) {
                req.session.auth = authObject;
                return next();
            }
            else {
                if (!noRedirect)
                    res.redirect('/login');
                else
                    return next();
            }
        });
    }
    else if (req.session.auth) {
        return next();
    }
    else {
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
function reauthenticate(req, res, next) {
    req['reauthenticate'] = true;
    return authenticate(req, res, next);
}
exports.reauthenticate = reauthenticate;
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
        let nis = require("os").networkInterfaces();
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
        return require("os").hostname();
    }
    catch (err) {
        return require("os").hostname();
    }
}
exports.machineId = machineId;
function getProject(req, id) {
    if (!req || !req.session || !req.session.auth)
        return null;
    let ret, projects = req.session.auth.projects;
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
    if (!req || !req.session || !req.session.auth)
        return null;
    let ret, projects = req.session.auth.projects, id = req.session.auth.currentProjectId;
    if (projects && id) {
        projects.forEach(function (item) {
            if (item.id == +id)
                ret = item;
        });
    }
    if (!ret && req.session.auth.projects && req.session.auth.projects.length > 0)
        ret = req.session.auth.projects[0];
    return ret || null;
}
exports.currentProject = currentProject;
function isSysAdmin(req) {
    return hasAdminPermission(req, 'admin');
}
exports.isSysAdmin = isSysAdmin;
function hasAdminPermission(req, permission) {
    try {
        if (!req || !req.session || !req.session.auth || !req.session.auth.user || !req.session.auth.user.permissions)
            return false;
        let user = req.session.auth.user;
        if (user.appId != 1)
            return false;
        for (let p = 0; p < user.permissions.length; p++) {
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