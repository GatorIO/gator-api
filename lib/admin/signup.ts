import utils = require('gator-utils');
import users = require('./users');
import login = require('./login');

let settings = utils.config.settings();

async function signup(params: any): Promise<any> {

    const user: any = {
        appId: settings.appId,
        name: params['username'],
        password: params['password'],
        firstName: params['firstName'],
        lastName: params['lastName'],
        email: params['email'],
        couponId: params['couponId'],
        status: 0,
        timezone: params['timezoneId'],
        accountData: params['accountData'],
        accountType: params['accountType'],
        remoteAddress: params['remoteAddress']
    };

    if (params['partnerId'])
        user.partnerId = params['partnerId'];

    await users.create(user);

    //  log in to get access token
    return await login(user.name, user.password, settings.appId, null);
}

export = signup;
