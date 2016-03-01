var utils = require("gator-utils");
var restify = require("restify");
exports.client = restify.createJsonClient({
    url: utils.config.settings()['apiUrl'],
    version: '*'
});
var ResponseResult = (function () {
    function ResponseResult(code, data, message) {
        if (code)
            this.code = code;
        if (message)
            this.message = message;
        if (data)
            this.data = data;
    }
    ResponseResult.prototype.toJson = function () {
        try {
            var doc = {};
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
    };
    return ResponseResult;
})();
exports.ResponseResult = ResponseResult;
function sendError(res, err) {
    var result = new ResponseResult();
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
exports.sendError = sendError;
function noCache(res) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
}
exports.noCache = noCache;
function redirect(res, location, code) {
    if (code === void 0) { code = 302; }
    res.header('Location', location);
    res.send(+code);
}
exports.redirect = redirect;
function send(res, data, message) {
    noCache(res);
    var response = new ResponseResult(200, data, message);
    res.json(response.toJson());
}
exports.send = send;
function sendConditional(res, err, data, message) {
    if (err)
        sendError(res, err);
    else
        res.json(new ResponseResult(200, data, message).toJson());
}
exports.sendConditional = sendConditional;
function isSecure(req) {
    if (utils.config.dev() || req.secure) {
        return true;
    }
    return req.header('X-Forwarded-Port') == 443;
}
exports.isSecure = isSecure;
//# sourceMappingURL=REST.js.map