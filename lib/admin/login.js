"use strict";
const utils = require("gator-utils");
const client = require("../client");
const errors = require("../errors");
async function login(name, password, appId, remoteAddress) {
    const params = {
        name: name,
        password: password,
        remoteAddress
    };
    if (utils.isNumeric(appId)) {
        params['appId'] = appId;
    }
    const result = await client.post('/v1/login', params);
    if (!result)
        throw new errors.APIError();
    return result.data;
}
module.exports = login;
//# sourceMappingURL=login.js.map