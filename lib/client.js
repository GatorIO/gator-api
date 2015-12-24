/// <reference path="../typings/gator-utils/gator-utils.d.ts" />
/// <reference path="../typings/restify/restify.d.ts" />
var utils = require("gator-utils");
var restify = require("restify");
//  The global restify client for the API calls
var client = restify.createJsonClient({
    url: utils.config.settings()['apiUrl'],
    version: '*'
});
module.exports = client;
//# sourceMappingURL=client.js.map