"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseResult = exports.client = void 0;
exports.sendError = sendError;
exports.noCache = noCache;
exports.redirect = redirect;
exports.send = send;
exports.sendConditional = sendConditional;
exports.isSecure = isSecure;
const utils = require("gator-utils");
const http = require("./http");
exports.client = http.createJsonClient({
    url: utils.config.settings()['apiUrl']
});
class ResponseResult {
    constructor(code, data, message) {
        if (code)
            this.code = code;
        if (message)
            this.message = message;
        if (data)
            this.data = data;
    }
    toJson() {
        try {
            let doc = {};
            if (this.code)
                doc['code'] = this.code;
            if (this.message)
                doc['message'] = this.message;
            if (this.data)
                doc['data'] = this.data;
            return doc;
        }
        catch (err) {
            return null;
        }
    }
}
exports.ResponseResult = ResponseResult;
function sendError(res, err) {
    let result = new ResponseResult();
    if (err.code)
        err.code = +err.code;
    if (err.message)
        result.message = err.message;
    if (err.code)
        result.code = err.code;
    if (err.statusCode)
        result.code = err.statusCode;
    if (!result.code)
        result.code = 500;
    if (result.code > 599) {
        res.status(409);
    }
    else {
        res.status(result.code);
    }
    noCache(res);
    res.json(result.toJson());
}
function noCache(res) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
}
function redirect(res, location, code = 302) {
    res.header('Location', location);
    res.send(+code);
}
function send(res, data, message) {
    noCache(res);
    let response = new ResponseResult(200, data, message);
    res.json(response.toJson());
}
function sendConditional(res, err, data, message) {
    if (err)
        sendError(res, err);
    else
        res.json(new ResponseResult(200, data, message).toJson());
}
function isSecure(req) {
    if (utils.config.dev() || req.secure) {
        return true;
    }
    return req.header('X-Forwarded-Port') == 443;
}
//# sourceMappingURL=REST.js.map