var client = require('../client');
var errors = require('../errors');
(function (AccountStatus) {
    AccountStatus[AccountStatus["active"] = 0] = "active";
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
                callback(new errors.APIError());
            else
                callback(null, result.data.account);
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
                callback(new errors.APIError());
            else
                callback(null, result.data.account);
        });
    }
    catch (err) {
        callback(err);
    }
}
exports.create = create;
//# sourceMappingURL=accounts.js.map