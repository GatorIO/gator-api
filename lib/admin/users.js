"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var client = require("../client");
var errors = require("../errors");
var UserStatus;
(function (UserStatus) {
    UserStatus[UserStatus["active"] = 0] = "active";
    UserStatus[UserStatus["lockedOut"] = 1] = "lockedOut";
})(UserStatus = exports.UserStatus || (exports.UserStatus = {}));
var User = (function () {
    function User() {
        this.status = UserStatus.active;
    }
    return User;
}());
exports.User = User;
function create(params, callback) {
    try {
        client.post('/v1/users', params, function (err, req, res, result) {
            if (err)
                callback(err);
            else if (!result)
                callback(new errors.APIError());
            else
                callback(null, result.data.user);
        });
    }
    catch (err) {
        callback(err);
    }
}
exports.create = create;
function authorize(accessToken, callback) {
    try {
        var params = { "accessToken": accessToken };
        client.post('/v1/authorize', params, function (err, req, res, result) {
            if (err)
                callback(err);
            else if (!result)
                callback(new errors.APIError());
            else
                callback(null, result.data);
        });
    }
    catch (err) {
        callback(err);
    }
}
exports.authorize = authorize;
//# sourceMappingURL=users.js.map