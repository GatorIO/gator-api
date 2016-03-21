"use strict";
var utils = require('gator-utils');
var client = require('../client');
var sessions = require('./sessions');
var errors = require('../errors');
module.exports = function (name, password, moduleId, callback) {
    try {
        var params = {
            name: name,
            password: password
        };
        if (utils.isNumeric(moduleId)) {
            params['moduleId'] = moduleId;
        }
        client.post('/v1/login', params, function (err, req, res, result) {
            if (err)
                callback(err);
            else if (!result)
                callback(new errors.APIError());
            else {
                var authObject = result.data;
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