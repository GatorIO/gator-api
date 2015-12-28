declare module 'gator-api' {

    export var client;

    export class APIError {
        message: string;
        code: number;
        constructor (message?: string);
    }

    export module modules {

        export class Permission {
            public id: number;
            public name: string;
            public description: string;
            constructor(id: number, name: string, description?: string);
        }

        export class Module {

            //  module attributes
            public id: number;
            public name: string;
            public permissions: Array<Permission>;     //  the available permissions for the module
        }

        export function getAll(callback: (err?: APIError, result?: Array<Module>) => void);
    }

    export module roles {

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
    }

    export module users {

        export enum UserStatus {
            active = 0,
            lockedOut = 1
        }

        export class User {
            public id: number;
            public name: string;
            public password: string;
            public firstName: string;
            public lastName: string;
            public status: UserStatus;
            public createdDate: Date;
            public lastUpdated: Date;
            public ipAddress: string;
            public roles: Array<roles.Role>;
        }

        export function create(params: any, callback: (err?: APIError, result?: any) => void);
        export function authorize(accessToken: string, callback: (err?: APIError, result?: any) => void);
    }

    export module accounts {

        export enum AccountStatus {
            active = 0,
            lockedOut = 1
        }

        export class Account {
            public id: number;
            public name: string;
            public createdDate: Date;
            public userId: string;
            public moduleId: string;
            public status: number;
            public ipAddress: string;
            public data: Object;
        }

        export function get(params: any, callback: (err?: APIError, result?: any) => void);
        export function create(params: any, callback: (err?: APIError, result?: any) => void);
    }

    export module projects {

        export class Project {

            //  module attributes
            public id: number;
            public accountId: number;
            public name: string;
            public enabled: boolean;
        }

        export function get(params: any, callback: (err?: APIError, projects?: Array<Project>) => void);
        export function create(params: any, callback: (err?: APIError, project?: Project) => void);
    }

    export class Authorization {
        accessToken: string;
        user: users.User;
        expiration: Date;
        account: accounts.Account;
        projects: Array<projects.Project>;
        currentProjectId: number;
    }

    export module sessions {
        export function set(authObject: any);
        export function get(accessToken: string);
    }

    export function login(name: string, password: string, moduleId: number, callback: (err?: APIError, result?: Authorization) => void);
    export function authorize(params: any, callback: (err?: APIError, result?: Authorization) => void);
    export function hasPermission(accessToken: string, moduleId: number, permission: string | number, callback: (err?: APIError, result?: boolean) => void);

    export function forgotPassword(email: string, host:string, callback:(err?:APIError, result?:boolean)=>void);
    export function resetPassword(accessToken: string, password:string, callback:(err?:APIError, result?:boolean)=>void);

    export function log(a1?: any, a2?: any, a3?: any, a4?: any, a5?: any);

    export module logs {
        export function log(a1?: any, a2?: any, a3?: any, a4?: any, a5?: any);
    }

    export function authenticate(req, res, next);
    export function authenticateNoRedirect(req, res, next);

    export function signup(params: any, callback: (err?: APIError, result?: Authorization) => void);
    export function setSessionCookie(res: any, accessToken: string);
    export function machineId() : string;
}
