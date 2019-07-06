"use strict";
const utils = require("gator-utils");
const restify = require("restify");
let client = restify.createJsonClient({
    url: utils.config.settings()['apiUrl'],
    version: '*',
    requestTimeout: 60000 * 5
});
module.exports = client;
//# sourceMappingURL=client.js.map