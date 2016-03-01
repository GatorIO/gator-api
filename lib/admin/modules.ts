/// <reference path="../../typings/node/node.d.ts" />
/// <reference path="../../typings/restify/restify.d.ts" />
import client = require('../client');
import errors = require('../errors');
import restify = require('restify');

export class Permission {
    public id: number;
    public name: string;
    public description: string;

    constructor(id: number, name: string, description?: string) {
        this.id = id;
        this.name = name;
        this.description = description;
    }
}

export class Module {

    //  module attributes
    public id: number;
    public name: string;
    public permissions: Array<Permission>;     //  the available permissions for the module
}

var cachedModules: Array<Module>;

export function getAll(callback: (err?: errors.APIError, result?: Array<Module>) => void) {

    try {

        if (cachedModules)
            callback(null, cachedModules);
        else {

            client.get('/v1/modules', function(err, req: restify.Request, res: restify.Response, result: any) {

                if (err)                                //  first, check for an exception
                    callback(err);
                else if (!result)                       //  then check for a missing result
                    callback(new errors.APIError());
                else {
                    cachedModules = result.data;
                    callback(null, result.data);        //  finally, return the payload
                }
            });
        }
    } catch(err){
        callback(err, null);
    }

}