import client = require('../client');
import errors = require('../errors');
import restify = require('restify');

//  Set up least recently used session cache
let LRU = require("lru-cache");
let cache = LRU(1000);

export function set(authObject: any) {

    if (authObject.hasOwnProperty('accessToken')) {
        cache.set(authObject.accessToken, authObject);
    }
}

export function get(accessToken: any) {
    let session = cache.get(accessToken);

    if (!session)
        return null;

    if (Date.parse(session.expiration) < new Date().getTime()) {
        cache.del(accessToken);
        return null;
    }

    return session;
}

export function remove(accessToken: any) {
    cache.del(accessToken);
}