var utils = require('gator-utils');
var users = require('./users');
var accounts = require('./accounts');
var api = require('../index');
var sessions = require('./sessions');
var settings = utils.config.settings();
var login = require('./login');
module.exports = function (params, callback) {
    try {
        var user = {
            name: params['username'],
            password: params['password'],
            firstName: params['firstName'],
            lastName: params['lastName'],
            status: 0,
            timezone: params['timezoneId']
        };
        users.create(user, function (err, newuser) {
            if (err) {
                callback(err);
                return;
            }
            login(user.name, user.password, null, function (err, authorization) {
                if (err) {
                    callback(err);
                }
                else {
                    var accountParams = {
                        accessToken: authorization.accessToken,
                        moduleId: settings.moduleId,
                        name: user.name,
                        status: 0
                    };
                    accounts.create(accountParams, function (err, account) {
                        if (err) {
                            callback(err);
                            return;
                        }
                        var authParams = {
                            moduleId: settings.moduleId,
                            accessToken: authorization.accessToken,
                            noCache: true
                        };
                        api.authorize(authParams, function (err, authObject) {
                            sessions.set(authObject);
                            callback(null, authObject);
                        });
                    });
                }
            });
        });
    }
    catch (err) {
        callback(err);
    }
};
//# sourceMappingURL=signup.js.map