"use strict";
var client = require('../client');
var errors = require('../errors');
var Permission = (function () {
    function Permission(id, description) {
        this.id = id;
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
                    cachedApps = result.data.applications;
                    callback(null, result.data.applications);
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