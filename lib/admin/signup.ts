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

        var user: any = {
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
        
        users.create(user, function(err, newuser){

            if (err) {
                callback(err);
                return;
            }

            //  log in to get access token
            login(user.name, user.password, settings.appId, function(err, authorization) {
                callback(err, authorization);
            });
        });
    } catch (err) {
        callback(err);
    }
};
