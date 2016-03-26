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
var cachedModules;
function getAll(callback) {
    try {
        if (cachedModules)
            callback(null, cachedModules);
        else {
            client.get('/v1/modules', function (err, req, res, result) {
                if (err)
                    callback(err);
                else if (!result)
                    callback(new errors.APIError());
                else {
                    cachedModules = result.data;
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