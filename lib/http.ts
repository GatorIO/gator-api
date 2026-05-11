import errors = require('./errors');

export interface ResponseBody {
    code?: number;
    message?: string;
    data?: any;
}

export interface ClientOptions {
    url: string;
    headers?: Record<string, string>;
    timeoutMs?: number;
}

export interface HttpClient {
    get(path: string, headers?: Record<string, string>): Promise<ResponseBody>;
    post(path: string, body?: any, headers?: Record<string, string>): Promise<ResponseBody>;
    put(path: string, body?: any, headers?: Record<string, string>): Promise<ResponseBody>;
    del(path: string, headers?: Record<string, string>): Promise<ResponseBody>;
}

export function createJsonClient(options: ClientOptions): HttpClient {

    const baseUrl = options.url.replace(/\/$/, '');
    const defaultHeaders = options.headers || {};
    const timeoutMs = options.timeoutMs ?? 60000;

    async function request(method: string, path: string, body?: any, headers?: Record<string, string>): Promise<ResponseBody> {

        const url = baseUrl + (path.startsWith('/') ? path : '/' + path);
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);

        try {

            const reqHeaders: Record<string, string> = {
                'Accept': 'application/json',
                ...defaultHeaders,
                ...(headers || {}),
            };

            const init: RequestInit = {
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
            let parsed: ResponseBody = {};

            if (text) {

                try {
                    parsed = JSON.parse(text);
                } catch {
                    parsed = { message: text };
                }
            }

            if (!res.ok) {
                const apiErr = new errors.APIError(parsed.message || res.statusText);
                apiErr.code = parsed.code || res.status;
                throw apiErr;
            }

            return parsed;
        } catch (err: any) {

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
        } finally {
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
