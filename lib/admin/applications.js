"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.items = exports.Application = exports.Permission = void 0;
exports.getAll = getAll;
const client = require("../client");
const errors = require("../errors");
class Permission {
    constructor(id, description) {
        this.id = id;
        this.description = description;
    }
}
exports.Permission = Permission;
class Application {
}
exports.Application = Application;
async function getAll() {
    if (exports.items)
        return exports.items;
    const result = await client.get('/v1/applications');
    if (!result)
        throw new errors.APIError();
    exports.items = result.data.applications;
    return exports.items;
}
//# sourceMappingURL=applications.js.map