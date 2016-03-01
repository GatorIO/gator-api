/// <reference path="../../typings/gator-utils/gator-utils.d.ts" />
import utils = require('gator-utils');
import users = require('./users');
import accounts = require('./accounts');
import errors = require('../errors');
import api = require('../index');
import sessions = require('./sessions');

var settings = utils.config.settings();
var login = require('./login');

module.exports = function(params: any, callback: Function) {

    try {

        var user = {
            name: params['username'],
            password: params['password'],
            firstName: params['firstName'],
            lastName: params['lastName'],
            status: 0,
            timezone: params['timezoneId']
        };

        users.create(user, function(err, newuser){

            if (err) {
                callback(err);
                return;
            }

            //  first log in with no module just to get access token
            login(user.name, user.password, null, function(err, authorization) {

                if (err) {
                    callback(err);
                } else {

                    //  for a newly registered user, create an account
                    var accountParams = {
                        accessToken: authorization.accessToken,
                        moduleId: settings.moduleId,
                        name: user.name,
                        status: 0
                    };

                    //  for a newly registered user, create an account
                    accounts.create(accountParams, function(err: errors.APIError, account: accounts.Account) {

                        if (err) {
                            callback(err);
                            return;
                        }

                        //  re-auth the user with the module id to get the new role info
                        login(user.name, user.password, settings.moduleId, function(err, authorization) {
                            sessions.set(authorization);
                            callback(err, authorization);
                        });
                    });
                }
            });
        });
    } catch (err) {
        callback(err);
    }
};
