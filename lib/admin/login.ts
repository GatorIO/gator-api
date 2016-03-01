/// <reference path="../../typings/restify/restify.d.ts" />
/// <reference path="../../typings/gator-utils/gator-utils.d.ts" />
import utils = require('gator-utils');
import restify = require('restify');
import client = require('../client');
import sessions = require('./sessions');
import accounts = require('./accounts');
import projects = require('./projects');
import errors = require('../errors');

module.exports = function(name: string, password: string, moduleId: number, callback: Function) {

    try {

        var params = {
            name: name,
            password: password
        };

        //  If the module is specified, it means the login is for a specific module(product).  Specifying the moduleId will
        //  check for the existance of an account for the user in that module and pull the user's account object into the authObject.
        if (utils.isNumeric(moduleId)) {
            params['moduleId'] = moduleId;
        }

        client.post('/v1/login', params, function (err, req: any, res: any, result: any) {

            if (err)                                //  first, check for an exception
                callback(err);
            else if (!result)                       //  then check for a missing result
                callback(new errors.APIError());
            else {
                var authObject = result.data;

                //  set the session object for the user - changes to authObject will be reflected
                sessions.set(authObject);
                callback(null, authObject);
            }
        });
    } catch (err) {
        callback(err);
    }
};