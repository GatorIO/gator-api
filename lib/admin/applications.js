"use strict";
var client = require('../client');
var errors = require('../errors');
var Permission = (function () {
    function Permission(id, name, description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }
    return Permission;
}());
exports.Permission = Permission;
var Application = (function () {
    function Application() {
    }
    return Application;
}());
exports.Application = Application;
var cachedApps;
function getAll(callback) {
    try {
        if (cachedApps)
            callback(null, cachedApps);
        else {
            client.get('/v1/applications', function (err, req, res, result) {
                if (err)
                    callback(err);
                else if (!result)
                    callback(new errors.APIError());
                else {
                    cachedApps = result.data;
                    callback(null, result.data);
                }
            });
        }
    }
    catch (err) {
        callback(err, null);
    }
}
exports.getAll = getAll;
//# sourceMappingURL=applications.js.map