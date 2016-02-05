var utils = require("gator-utils");
var _client = require('./client');
var APIError = require('./APIError');
var _modules = require('./admin/modules');
var _users = require('./admin/users');
var _accounts = require('./admin/accounts');
var _roles = require('./admin/roles');
var _projects = require('./admin/projects');
var settings = utils.config.settings();
exports.client = _client;
exports.roles = _roles;
exports.users = _users;
exports.accounts = _accounts;
exports.modules = _modules;
exports.projects = _projects;
exports.logs = require('./admin/logs');
exports.login = require('./admin/login');
exports.signup = require('./admin/signup');
exports.sessions = require('./admin/sessions');
var Authorization = (function () {
    function Authorization() {
    }
    return Authorization;
})();
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
                callback(new APIError());
            else
                callback(null, result.data);
        });
    }
    catch (err) {
        callback(err);
    }
}
exports.authorize = authorize;
function hasPermission(accessToken, moduleId, permission, callback) {
    exports.modules.getAll(function (err, mods) {
        if (err)
            callback(err);
        else {
            authorize(accessToken, function (err, authorization) {
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
                                }
                                else {
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
exports.hasPermission = hasPermission;
function resetPassword(accessToken, password, callback) {
    try {
        var params = { "password": password };
        exports.client.post('/v1/users/resetpassword/' + accessToken, params, function (err, req, res, result) {
            if (err)
                callback(err);
            else if (!result)
                callback(new APIError());
            else
                callback(null, result);
        });
    }
    catch (err) {
        callback(err);
    }
}
exports.resetPassword = resetPassword;
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
            if (settings.hasOwnProperty('moduleId'))
                authParams['moduleId'] = +settings.moduleId;
            authorize(authParams, function (err, authObject) {
                if (!err && authObject) {
                    exports.sessions.set(authObject);
                    req.session = authObject;
                    return next();
                }
                else {
                    req.session = null;
                    if (!req['noRedirect'])
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
        if (!req['noRedirect'])
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
//# sourceMappingURL=index.js.map