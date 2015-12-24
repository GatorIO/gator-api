/// <reference path="../../typings/restify/restify.d.ts" />
var client = require('../client');
var APIError = require('../APIError');
(function (AccountStatus) {
    /**
     * active user able to log into the system
     */
    AccountStatus[AccountStatus["active"] = 0] = "active";
    /**
     * Locked out of the system due to password or other issues
     */
    AccountStatus[AccountStatus["lockedOut"] = 1] = "lockedOut";
})(exports.AccountStatus || (exports.AccountStatus = {}));
var AccountStatus = exports.AccountStatus;
var Account = (function () {
    function Account() {
    }
    return Account;
})();
exports.Account = Account;
function get(params, callback) {
    try {
        client.get('/v1/accounts/' + params.accountId + '?accessToken=' + params.accessToken, function (err, req, res, result) {
            if (err)
                callback(err);
            else if (!result)
                callback(new APIError());
            else
                callback(null, result.data.account); //  finally, return the payload
        });
    }
    catch (err) {
        callback(err);
    }
}
exports.get = get;
function create(params, callback) {
    try {
        client.post('/v1/accounts', params, function (err, req, res, result) {
            if (err)
                callback(err);
            else if (!result)
                callback(new APIError());
            else
                callback(null, result.data.account); //  finally, return the payload
        });
    }
    catch (err) {
        callback(err);
    }
}
exports.create = create;
//# sourceMappingURL=accounts.js.map