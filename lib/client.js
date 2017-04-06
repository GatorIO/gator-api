"use strict";
const utils = require("gator-utils");
const restify = require("restify");
var client = restify.createJsonClient({
    url: utils.config.settings()['apiUrl'],
    version: '*'
});
module.exports = client;
//# sourceMappingURL=client.js.map