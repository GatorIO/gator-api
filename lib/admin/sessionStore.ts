import utils = require("gator-utils");
import http = require("../http");
let util = require('util');

//  use a JSON client
let client: http.HttpClient = http.createJsonClient({
    url: utils.config.settings()['apiUrl']
});

/**
 * Return the `APIStore` extending `express`'s session Store.
 * @param {Function} connect connect-compatible session middleware (e.g. Express 3, express-session)
 */
module.exports = function(connect) {

    let Store = connect.Store || connect.session.Store;

    function APIStore(options) {
        let self = this;
        options = options || {};
        Store.call(this, options);
    }

    util.inherits(APIStore, Store);

    APIStore.prototype.get = function(sid, callback) {

        (async () => {

            try {
                const result = await client.get('/v1/sessions/' + sid);

                if (!result.data)
                    return callback();

                return callback(null, result.data.data);
            } catch (err) {
                return callback(err);
            }
        })();
    };

    APIStore.prototype.destroy = function(sid, callback) {

        (async () => {

            try {
                await client.del('/v1/sessions/' + sid);
                return callback();
            } catch (err) {
                return callback(err);
            }
        })();
    };

    APIStore.prototype.set = function(sid, data, callback) {

        (async () => {

            try {
                let lastAccess = new Date();
                let expires: Date = new Date(lastAccess.setDate(lastAccess.getDate() + 1));

                if (typeof data.cookie != 'undefined')
                    expires = new Date(data.cookie._expires);

                if (typeof data.lastAccess != 'undefined')
                    lastAccess = new Date(data.lastAccess);

                let update = {
                    data: data,
                    lastAccess: lastAccess,
                    expires: expires,
                    appId: utils.config.settings().appId
                };

                await client.put('/v1/sessions/' + sid, update);

                if (callback)
                    return callback();
            } catch (err) {
                if (callback)
                    return callback(err);
            }
        })();
    };

    return APIStore;
};
