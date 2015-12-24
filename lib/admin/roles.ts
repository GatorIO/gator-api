/// <reference path="../../typings/gator-utils/gator-utils.d.ts" />
import APIError = require('../APIError');
import utils = require("gator-utils");
import modules = require("./modules");

export class Role {

    //  role attributes
    public id: number;

    public moduleId: number;        //  ---------------
    public accountId: number;       //  unique index
    public name: string;            //  ---------------

    public createdByUserId: number;
    public description: string;
    public permissions: Array<modules.Permission>;
}
