import client = require('../client');
import errors = require('../errors');
import utils = require("gator-utils");

export enum AccountStatus {
    /**
     * active user able to log into the system
     */
    active = 0,
    /**
     * Locked out of the system due to password or other issues
     */
    lockedOut = 1
}

export class Account {
    public id: number;
    public name: string;
    public createdDate: Date;
    public userId: string;
    public appId: string;
    public status: number;
    public ipAddress: string;
}

export async function get(params: any): Promise<Account> {

    const result = await client.get('/v1/accounts/' + params.accountId + '?accessToken=' + params.accessToken);

    if (!result)
        throw new errors.APIError();

    return result.data.account;
}

export async function create(params: any): Promise<any> {

    const result = await client.post('/v1/accounts', params);

    if (!result)
        throw new errors.APIError();

    return result.data.account;
}

/**
 * Set the partner id on for the authenticated user.
 * @param req
 * @param partnerId
 */
export async function setPartnerId(req: any, partnerId: number): Promise<void> {

    if (!utils.isNumeric(partnerId))
        throw new errors.BadRequestError('The partner id must be a number.');

    if (!req || !req.session)
        throw new errors.UnauthorizedError();

    const params = {
        accessToken: req.session.accessToken,
        update: {
            partnerId: +partnerId
        }
    };

    await client.put('/v1/accounts', params);
}
