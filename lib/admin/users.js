"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserStatus = void 0;
exports.create = create;
exports.authorize = authorize;
const client = require("../client");
const errors = require("../errors");
var UserStatus;
(function (UserStatus) {
    UserStatus[UserStatus["active"] = 0] = "active";
    UserStatus[UserStatus["lockedOut"] = 1] = "lockedOut";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
class User {
    constructor() {
        this.status = UserStatus.active;
    }
}
exports.User = User;
async function create(params) {
    const result = await client.post('/v1/users', params);
    if (!result)
        throw new errors.APIError();
    return result.data.user;
}
async function authorize(accessToken) {
    const params = { "accessToken": accessToken };
    const result = await client.post('/v1/authorize', params);
    if (!result)
        throw new errors.APIError();
    return result.data;
}
//# sourceMappingURL=users.js.map