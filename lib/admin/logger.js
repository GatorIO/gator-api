"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Levels = void 0;
exports.createEntry = createEntry;
exports.fatal = fatal;
exports.error = error;
exports.warn = warn;
exports.info = info;
exports.trace = trace;
const client = require("../client");
const utils = require("gator-utils");
var Levels;
(function (Levels) {
    Levels[Levels["fatal"] = 0] = "fatal";
    Levels[Levels["error"] = 1] = "error";
    Levels[Levels["warn"] = 2] = "warn";
    Levels[Levels["info"] = 3] = "info";
    Levels[Levels["trace"] = 4] = "trace";
})(Levels || (exports.Levels = Levels = {}));
async function createEntry(level, items) {
    let params;
    try {
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            if (typeof item === 'object' && item instanceof Error) {
                items[i] = {
                    error: item.message,
                    name: item.name,
                    stack: item.stack
                };
            }
            if (typeof item === 'object' && item.constructor && item.constructor.name === 'IncomingMessage') {
                items[i] = {
                    user: item.session && item.session.user ? item.session.user.name : undefined,
                    url: item.originalUrl,
                    ip: utils.ip.remoteAddress(item),
                    userAgent: item.headers ? item.headers['user-agent'] : undefined
                };
            }
        }
        params = {
            level: level,
            data: items
        };
        if (utils.isNumeric(utils.config.settings()['appId']))
            params.appId = utils.config.settings()['appId'];
        await client.post('/v1/ops/logs', params);
    }
    catch (err) {
        console.log('logger after client.post', err);
        if (params)
            console.dir(params);
    }
}
function fatal(...items) {
    createEntry(Levels.fatal, items);
}
function error(...items) {
    createEntry(Levels.error, items);
}
function warn(...items) {
    createEntry(Levels.warn, items);
}
function info(...items) {
    createEntry(Levels.info, items);
}
function trace(...items) {
    createEntry(Levels.trace, items);
}
//# sourceMappingURL=logger.js.map