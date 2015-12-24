/// <reference path="../../typings/restify/restify.d.ts" />
/// <reference path="../../typings/gator-utils/gator-utils.d.ts" />
var utils = require('gator-utils');
var client = require('../client');
var sessions = require('./sessions');
var APIError = require('../APIError');
module.exports = function (name, password, moduleId, callback) {
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
        client.post('/v1/login', params, function (err, req, res, result) {
            if (err)
                callback(err);
            else if (!result)
                callback(new APIError());
            else {
                var authObject = result.data;
                //  set the session object for the user - changes to authObject will be reflected
                sessions.set(authObject);
                callback(null, authObject);
            }
        });
    }
    catch (err) {
        callback(err);
    }
};
//# sourceMappingURL=login.js.map