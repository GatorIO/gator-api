/// <reference path="../typings/gator-utils/gator-utils.d.ts" />
/// <reference path="../typings/restify/restify.d.ts" />
import utils = require("gator-utils");
import restify = require("restify");

/*
 Common REST API functions
 */


//  The global restify client for the API calls
export var client: restify.Client = restify.createJsonClient({
    url: utils.config.settings()['apiUrl'],
    version: '*'
});

export class ResponseResult {

    constructor(code?: number, data?: Object, message?: string) {

        if (code)
            this.code = code;

        if (message)
            this.message = message;

        if (data)
            this.data = data;
    }

    //  The HTTP status code.  This will be 200 for successful requests.
    code: number;

    //  A message associated with the response.  This will generally contain error messages.
    message: string;

    //  The payload.
    data: Object;

    public toJson(): Object {

        try {

            var doc = {};

            if (this.code)
                doc['code'] = this.code;

            if (this.message)
                doc['message'] = this.message;

            if (this.data)
                doc['data'] = this.data;

            return doc;
        } catch (err) {
            return null;
        }
    }
}

//  Convert an error object into a response.
export function sendError(res: any, err: any) {
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
        //  Status code for conflict
        res.status(409);
    } else {
        res.status(result.code);
    }
    noCache(res);
    res.json(result.toJson());
}

export function noCache(res: any) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
}

export function redirect(res: any, location: string, code: number = 302) {
    res.header('Location', location);
    res.send(+code);
}

//  Send a successful response to client.
export function send(res: any, data?: Object, message?: string) {
    noCache(res);

    var response = new ResponseResult(200, data, message);
    res.json(response.toJson());
}

//  If an error is present, send the error, else send the object and message
export function sendConditional(res: any, err: any, data?: Object, message?: string) {

    if (err)
        sendError(res, err);
    else
        res.json(new ResponseResult(200, data, message).toJson());
}

//  Check that a secure connection is used
export function isSecure(req): boolean {

    if (utils.config.dev() || req.secure || req.hostname == 'localhost') {
        return true;
    }

    //  in a load balanced situation, check the forwarded headers for the port the request originated on
    return req.header('X-Forwarded-Port') == 443;
}
