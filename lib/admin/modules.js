/// <reference path="../../typings/node/node.d.ts" />
/// <reference path="../../typings/restify/restify.d.ts" />
var client = require('../client');
var APIError = require('../APIError');
var Permission = (function () {
    function Permission(id, name, description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }
    return Permission;
})();
exports.Permission = Permission;
var Module = (function () {
    function Module() {
    }
    return Module;
})();
exports.Module = Module;
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
                    callback(new APIError());
                else {
                    cachedModules = result.data;
                    callback(null, result.data); //  finally, return the payload
                }
            });
        }
    }
    catch (err) {
        callback(err, null);
    }
}
exports.getAll = getAll;
//# sourceMappingURL=modules.js.map