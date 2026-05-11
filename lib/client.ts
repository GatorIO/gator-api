import utils = require("gator-utils");
import http = require("./http");

//  The global JSON client for the API calls

let client: http.HttpClient = http.createJsonClient({
    url: utils.config.settings()['apiUrl'],
    timeoutMs: 60000 * 5
});

export = client;
