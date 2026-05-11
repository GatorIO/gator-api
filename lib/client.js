"use strict";
const utils = require("gator-utils");
const http = require("./http");
let client = http.createJsonClient({
    url: utils.config.settings()['apiUrl'],
    timeoutMs: 60000 * 5
});
module.exports = client;
//# sourceMappingURL=client.js.map