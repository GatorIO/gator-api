import utils = require('gator-utils');
import client = require('../client');
import errors = require('../errors');

async function login(name: string, password: string, appId: number, remoteAddress: string): Promise<any> {

    const params: any = {
        name: name,
        password: password,
        remoteAddress
    };

    //  If the appId is specified, it means the login is for a specific app(product).  Specifying the appId will
    //  check for the existance of an account for the user in that app and pull the user's account object into the authObject.
    if (utils.isNumeric(appId)) {
        params['appId'] = appId;
    }

    const result = await client.post('/v1/login', params);

    if (!result)
        throw new errors.APIError();

    return result.data;
}

export = login;
