"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = exports.Permission = void 0;
exports.get = get;
exports.create = create;
const client = require("../client");
const errors = require("../errors");
class Permission {
    constructor(id, name, description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }
}
exports.Permission = Permission;
class Project {
}
exports.Project = Project;
async function get(params) {
    const result = await client.get('/v1/projects?accessToken=' + params.accessToken);
    if (!result)
        throw new errors.APIError();
    return result.data.projects;
}
async function create(params) {
    const result = await client.post('/v1/projects', params);
    if (!result)
        throw new errors.APIError();
    return result.data.project;
}
//# sourceMappingURL=projects.js.map