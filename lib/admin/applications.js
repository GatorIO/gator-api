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
function getAll(callback) {
    try {
        if (exports.items)
            callback(null, exports.items);
        else {
            client.get('/v1/applications', function (err, req, res, result) {
                if (err)
                    callback(err);
                else if (!result)
                    callback(new errors.APIError());
                else {
                    exports.items = result.data.applications;
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