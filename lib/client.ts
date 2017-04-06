import utils = require("gator-utils");
import restify = require("restify");

//  The global restify client for the API calls

var client: restify.Client = restify.createJsonClient({
    url: utils.config.settings()['apiUrl'],
    version: '*'
});

export = client;

