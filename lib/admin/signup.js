"use strict";
const utils = require("gator-utils");
const users = require("./users");
const login = require("./login");
let settings = utils.config.settings();
async function signup(params) {
    const user = {
        appId: settings.appId,
        name: params['username'],
        password: params['password'],
        firstName: params['firstName'],
        lastName: params['lastName'],
        email: params['email'],
        couponId: params['couponId'],
        status: 0,
        timezone: params['timezoneId'],
        accountData: params['accountData'],
        accountType: params['accountType'],
        remoteAddress: params['remoteAddress']
    };
    if (params['partnerId'])
        user.partnerId = params['partnerId'];
    await users.create(user);
    return await login(user.name, user.password, settings.appId, null);
}
module.exports = signup;
//# sourceMappingURL=signup.js.map