"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authorization = exports.REST = exports.signup = exports.login = exports.logger = exports.logs = exports.reporting = exports.projects = exports.applications = exports.accounts = exports.users = exports.errors = exports.sessionStore = exports.client = void 0;
exports.log = log;
exports.sessionClient = sessionClient;
exports.authorize = authorize;
exports.setSessionAuth = setSessionAuth;
exports.clearSessionAuth = clearSessionAuth;
exports.authenticate = authenticate;
exports.authenticateNoRedirect = authenticateNoRedirect;
exports.reauthenticate = reauthenticate;
exports.logout = logout;
exports.machineId = machineId;
exports.getProject = getProject;
exports.currentProject = currentProject;
exports.isSysAdmin = isSysAdmin;
exports.hasAdminPermission = hasAdminPermission;
const utils = require("gator-utils");
const http = require("./http");
const _client = require("./client");
const _sessionStore = require("./admin/sessionStore");
const _errors = require("./errors");
const _applications = require("./admin/applications");
const _users = require("./admin/users");
const _accounts = require("./admin/accounts");
const _projects = require("./admin/projects");
const _reporting = require("./reporting");
let settings = utils.config.settings();
exports.client = _client;
exports.sessionStore = _sessionStore;
exports.errors = _errors;
exports.users = _users;
exports.accounts = _accounts;
exports.applications = _applications;
exports.projects = _projects;
exports.reporting = _reporting;
exports.logs = require('./admin/logs');
exports.logger = require('./admin/logger');
exports.login = require('./admin/login');
exports.signup = require('./admin/signup');
exports.REST = require('./REST');
class Authorization {
}
exports.Authorization = Authorization;
function log(a1, a2, a3, a4, a5) {
    exports.logs.log(a1, a2, a3, a4, a5);
}
function sessionClient(req) {
    const clientParams = {
        url: utils.config.settings()['apiUrl']
    };
    if (req.session && req.session.accessToken) {
        clientParams.headers = {
            Authorization: 'Bearer ' + req.session.accessToken
        };
    }
    return http.createJsonClient(clientParams);
}
async function authorize(params) {
    const result = await exports.client.post('/v1/authorize', params);
    if (!result)
        throw new exports.errors.APIError();
    return result.data;
}
function setSessionAuth(req, auth) {
    req.session.accessToken = auth.accessToken;
    req.session.adminMode = auth.adminMode;
    req.session.user = auth.user;
    req.session.expiration = auth.expiration;
    req.session.account = auth.account;
    req.session.projects = auth.projects;
    req.session.projectId = auth.projectId;
    req.session.currentProjectId = auth.currentProjectId;
}
function clearSessionAuth(req) {
    delete req.session.accessToken;
    delete req.session.adminMode;
    delete req.session.user;
    delete req.session.expiration;
    delete req.session.account;
    delete req.session.projects;
    delete req.session.projectId;
    delete req.session.currentProjectId;
}
function authenticate(req, res, next) {
    let accessToken, noRedirect = req['noRedirect'], reauthenticate = req['reauthenticate'];
    delete req['noRedirect'];
    delete req['reauthenticate'];
    if ((req.query && req.query.accessToken) || (reauthenticate && req.session && req.session.accessToken)) {
        if (req.query && req.query.accessToken)
            accessToken = req.query.accessToken;
        else
            accessToken = req.session.accessToken;
        let authParams = {
            accessToken: accessToken,
            noCache: true
        };
        if (settings.hasOwnProperty('appId'))
            authParams['appId'] = +settings.appId;
        (async () => {
            try {
                const authObject = await authorize(authParams);
                if (authObject) {
                    setSessionAuth(req, authObject);
                    return next();
                }
                if (!noRedirect)
                    res.redirect('/login');
                else
                    return next();
            }
            catch (err) {
                if (!noRedirect)
                    res.redirect('/login');
                else
                    return next();
            }
        })();
    }
    else if (req.session.accessToken) {
        return next();
    }
    else {
        if (!noRedirect)
            res.redirect('/login');
        else
            return next();
    }
}
function authenticateNoRedirect(req, res, next) {
    req['noRedirect'] = true;
    return authenticate(req, res, next);
}
function reauthenticate(req, res, next) {
    req['reauthenticate'] = true;
    return authenticate(req, res, next);
}
function logout(req, res) {
    if (req.session) {
        req.session.destroy(function (err) {
            res.redirect('/login');
        });
    }
}
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
function getProject(req, id) {
    if (!req || !req.session || !req.session.accessToken)
        return null;
    let ret, projects = req.session.projects;
    if (projects && id) {
        projects.forEach(function (item) {
            if (item.id == +id)
                ret = item;
        });
    }
    return ret || null;
}
function currentProject(req) {
    if (!req || !req.session || !req.session.accessToken)
        return null;
    let ret, projects = req.session.projects, id = req.session.currentProjectId;
    if (projects && id) {
        projects.forEach(function (item) {
            if (item.id == +id)
                ret = item;
        });
    }
    if (!ret && req.session.projects && req.session.projects.length > 0)
        ret = req.session.projects[0];
    return ret || null;
}
function isSysAdmin(req) {
    return hasAdminPermission(req, 'admin');
}
function hasAdminPermission(req, permission) {
    try {
        if (!req || !req.session || !req.session.user || !req.session.user.permissions)
            return false;
        let user = req.session.user;
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
//# sourceMappingURL=index.js.map