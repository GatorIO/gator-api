"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = exports.AccountStatus = void 0;
exports.get = get;
exports.create = create;
exports.setPartnerId = setPartnerId;
const client = require("../client");
const errors = require("../errors");
const utils = require("gator-utils");
var AccountStatus;
(function (AccountStatus) {
    AccountStatus[AccountStatus["active"] = 0] = "active";
    AccountStatus[AccountStatus["lockedOut"] = 1] = "lockedOut";
})(AccountStatus || (exports.AccountStatus = AccountStatus = {}));
class Account {
}
exports.Account = Account;
async function get(params) {
    const result = await client.get('/v1/accounts/' + params.accountId + '?accessToken=' + params.accessToken);
    if (!result)
        throw new errors.APIError();
    return result.data.account;
}
async function create(params) {
    const result = await client.post('/v1/accounts', params);
    if (!result)
        throw new errors.APIError();
    return result.data.account;
}
async function setPartnerId(req, partnerId) {
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
//# sourceMappingURL=accounts.js.map