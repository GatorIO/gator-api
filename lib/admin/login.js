"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils = require("gator-utils");
const client = require("../client");
const sessions = require("./sessions");
const errors = require("../errors");
module.exports = function (name, password, appId, callback) {
    try {
        let params = {
            name: name,
            password: password
        };
        if (utils.isNumeric(appId)) {
            params['appId'] = appId;
        }
        client.post('/v1/login', params, function (err, req, res, result) {
            if (err)
                callback(err);
            else if (!result)
                callback(new errors.APIError());
            else {
                let authObject = result.data;
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