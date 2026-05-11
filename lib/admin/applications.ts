import client = require('../client');
import errors = require('../errors');

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
    public commissions: boolean;
    public permissions: Array<Permission>;     //  the available permissions for the module

    public reporting: {
        apiEndpoint: string
    };
}

export let items: Array<Application>;

export async function getAll(): Promise<Array<Application>> {

    if (items)
        return items;

    const result = await client.get('/v1/applications');

    if (!result)
        throw new errors.APIError();

    items = result.data.applications;
    return items;
}
