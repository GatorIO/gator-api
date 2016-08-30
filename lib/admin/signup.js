"use strict";
var utils = require('gator-utils');
var users = require('./users');
var settings = utils.config.settings();
var login = require('./login');
module.exports = function (params, callback) {
    try {
        var user = {
            appId: settings.appId,
            name: params['username'],
            password: params['password'],
            firstName: params['firstName'],
            lastName: params['lastName'],
            email: params['email'],
            status: 0,
            timezone: params['timezoneId'],
            accountData: params['accountData'],
            accountType: params['accountType']
        };
        if (params['partnerId'])
            user.partnerId = params['partnerId'];
        users.create(user, function (err, newuser) {
            if (err) {
                callback(err);
                return;
            }
            login(user.name, user.password, settings.appId, function (err, authorization) {
                callback(err, authorization);
            });
        });
    }
    catch (err) {
        callback(err);
    }
};
//# sourceMappingURL=signup.js.map