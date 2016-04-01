/// <reference path="../../typings/node/node.d.ts" />
/// <reference path="../../typings/restify/restify.d.ts" />
import client = require('../client');
import errors = require('../errors');
import restify = require('restify');

export class Permission {
    public id: string;
    public description: string;

    constructor(id: string, description?: string) {
        this.id = id;
        this.description = description;
    }
}

export class Application {

    //  module attributes
    public id: number;
    public name: string;
    public description: string;
    public host: string;
    public devHost: string;
    public commissions: boolean;
    public permissions: Array<Permission>;     //  the available permissions for the module
}

var cachedApps: Array<Application>;

export function getAll(callback: (err?: errors.APIError, result?: Array<Application>) => void) {

    try {

        if (cachedApps)
            callback(null, cachedApps);
        else {

            client.get('/v1/applications', function(err, req: restify.Request, res: restify.Response, result: any) {

                if (err)                                //  first, check for an exception
                    callback(err);
                else if (!result)                       //  then check for a missing result
                    callback(new errors.APIError());
                else {
                    cachedApps = result.data.applications;
                    callback(null, result.data.applications);        //  finally, return the payload
                }
            });
        }
    } catch(err){
        callback(err, null);
    }

}