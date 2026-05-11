import client = require('../client');
import errors = require('../errors');

export enum UserStatus {
    /**
     * active user able to log into the system
     */
    active = 0,
    /**
     * Locked out of the system due to password or other issues
     */
    lockedOut = 1
}

export class User {
    public id: number;
    public name: string;
    public password: string;
    public firstName: string;
    public lastName: string;
    public status: UserStatus = UserStatus.active;
    public createdDate: Date;
    public lastUpdated: Date;
    public ipAddress: string;
}

export async function create(params: any): Promise<any> {

    const result = await client.post('/v1/users', params);

    if (!result)
        throw new errors.APIError();

    return result.data.user;
}

export async function authorize(accessToken: string): Promise<any> {

    const params = { "accessToken": accessToken };
    const result = await client.post('/v1/authorize', params);

    if (!result)
        throw new errors.APIError();

    return result.data;
}
