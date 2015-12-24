/// <reference path="../../typings/node/node.d.ts" />
/// <reference path="../../typings/restify/restify.d.ts" />
var client = require('../client');
var APIError = require('../APIError');
(function (UserStatus) {
    /**
     * active user able to log into the system
     */
    UserStatus[UserStatus["active"] = 0] = "active";
    /**
     * Locked out of the system due to password or other issues
     */
    UserStatus[UserStatus["lockedOut"] = 1] = "lockedOut";
})(exports.UserStatus || (exports.UserStatus = {}));
var UserStatus = exports.UserStatus;
var User = (function () {
    function User() {
        this.status = UserStatus.active;
    }
    return User;
})();
exports.User = User;
function create(params, callback) {
    try {
        client.post('/v1/users', params, function (err, req, res, result) {
            if (err)
                callback(err);
            else if (!result)
                callback(new APIError());
            else
                callback(null, result.data.user); //  finally, return the payload
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
                callback(new APIError());
            else
                callback(null, result.data); //  finally, return the payload
        });
    }
    catch (err) {
        callback(err);
    }
}
exports.authorize = authorize;
//# sourceMappingURL=users.js.map