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
var Project = (function () {
    function Project() {
    }
    return Project;
})();
exports.Project = Project;
function get(params, callback) {
    try {
        client.get('/v1/projects/account/' + params.accountId + '?accessToken=' + params.accessToken, function (err, req, res, result) {
            if (err)
                callback(err);
            else if (!result)
                callback(new APIError());
            else
                callback(null, result.data.projects); //  finally, return the payload
        });
    }
    catch (err) {
        callback(err);
    }
}
exports.get = get;
function create(params, callback) {
    try {
        client.post('/v1/projects', params, function (err, req, res, result) {
            if (err)
                callback(err);
            else if (!result)
                callback(new APIError());
            else
                callback(null, result.data.project); //  finally, return the payload
        });
    }
    catch (err) {
        callback(err);
    }
}
exports.create = create;
//# sourceMappingURL=projects.js.map