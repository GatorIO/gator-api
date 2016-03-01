/// <reference path="../../typings/node/node.d.ts" />
/// <reference path="../../typings/restify/restify.d.ts" />
/// <reference path="../../typings/lru-cache/lru-cache.d.ts" />
import client = require('../client');
import errors = require('../errors');
import restify = require('restify');

//  Set up least recently used session cache
var LRU = require("lru-cache");
var cache = LRU(1000);

export function set(authObject: any) {

    if (authObject.hasOwnProperty('accessToken')) {
        cache.set(authObject.accessToken, authObject);
    }
}

export function get(accessToken: any) {
    var session = cache.get(accessToken);

    if (!session)
        return null;

    if (Date.parse(session.expiration) < new Date().getTime()) {
        cache.del(accessToken);
        return null;
    }

    return session;
}