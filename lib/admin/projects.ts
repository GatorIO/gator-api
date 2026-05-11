import client = require('../client');
import errors = require('../errors');

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

export class Project {

    //  module attributes
    public id: number;
    public accountId: number;
    public name: string;
    public enabled: boolean;
    public data: any;
}

export async function get(params: any): Promise<Array<Project>> {

    const result = await client.get('/v1/projects?accessToken=' + params.accessToken);

    if (!result)
        throw new errors.APIError();

    return result.data.projects;
}

export async function create(params: any): Promise<Project> {

    const result = await client.post('/v1/projects', params);

    if (!result)
        throw new errors.APIError();

    return result.data.project;
}
