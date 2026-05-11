"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJsonClient = createJsonClient;
const errors = require("./errors");
function createJsonClient(options) {
    const baseUrl = options.url.replace(/\/$/, '');
    const defaultHeaders = options.headers || {};
    const timeoutMs = options.timeoutMs ?? 60000;
    async function request(method, path, body, headers) {
        const url = baseUrl + (path.startsWith('/') ? path : '/' + path);
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        try {
            const reqHeaders = {
                'Accept': 'application/json',
                ...defaultHeaders,
                ...(headers || {}),
            };
            const init = {
                method,
                headers: reqHeaders,
                signal: controller.signal,
            };
            if (body !== undefined && body !== null && method !== 'GET' && method !== 'DELETE') {
                reqHeaders['Content-Type'] = 'application/json';
                init.body = JSON.stringify(body);
            }
            const res = await fetch(url, init);
            const text = await res.text();
            let parsed = {};
            if (text) {
                try {
                    parsed = JSON.parse(text);
                }
                catch {
                    parsed = { message: text };
                }
            }
            if (!res.ok) {
                const apiErr = new errors.APIError(parsed.message || res.statusText);
                apiErr.code = parsed.code || res.status;
                throw apiErr;
            }
            return parsed;
        }
        catch (err) {
            if (err instanceof errors.APIError)
                throw err;
            if (err && err.name === 'AbortError') {
                const e = new errors.APIError('Request timeout');
                e.code = 504;
                throw e;
            }
            const e = new errors.APIError(err && err.message ? err.message : 'Network error');
            e.code = 500;
            throw e;
        }
        finally {
            clearTimeout(timer);
        }
    }
    return {
        get: (path, headers) => request('GET', path, undefined, headers),
        post: (path, body, headers) => request('POST', path, body, headers),
        put: (path, body, headers) => request('PUT', path, body, headers),
        del: (path, headers) => request('DELETE', path, undefined, headers),
    };
}
//# sourceMappingURL=http.js.map