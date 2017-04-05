"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LRU = require("lru-cache");
var cache = LRU(1000);
function set(authObject) {
    if (authObject.hasOwnProperty('accessToken')) {
        cache.set(authObject.accessToken, authObject);
    }
}
exports.set = set;
function get(accessToken) {
    var session = cache.get(accessToken);
    if (!session)
        return null;
    if (Date.parse(session.expiration) < new Date().getTime()) {
        cache.del(accessToken);
        return null;
    }
    return session;
}
exports.get = get;
function remove(accessToken) {
    cache.del(accessToken);
}
exports.remove = remove;
//# sourceMappingURL=sessions.js.map