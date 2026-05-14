"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = log;
const client = require("../client");
const utils = require("gator-utils");
async function log(a1, a2, a3, a4, a5) {
    let entry = {};
    try {
        if (utils.isNumeric(utils.config.settings()['appId']))
            entry.appId = utils.config.settings()['appId'];
        if (a1)
            entry['data1'] = a1;
        if (a2)
            entry['data2'] = a2;
        if (a3)
            entry['data3'] = a3;
        if (a4)
            entry['data4'] = a4;
        if (a5)
            entry['data5'] = a5;
        await client.post('/v1/ops/logs', entry);
    }
    catch (err) {
        console.log('logger after client.post', err);
        console.dir(entry);
    }
}
//# sourceMappingURL=logs.js.map