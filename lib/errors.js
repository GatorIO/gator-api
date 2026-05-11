"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationTimeoutError = exports.BadRequestError = exports.UnauthorizedError = exports.MissingParameterError = exports.NotFoundError = exports.DuplicateError = exports.InternalError = exports.APIError = void 0;
class APIError {
    message;
    code = 500;
    constructor(message) {
        if (message)
            this.message = message;
        else
            this.message = 'Unknown error';
    }
}
exports.APIError = APIError;
class InternalError {
    message;
    code = 500;
    constructor(message) {
        if (message)
            this.message = message;
        else
            this.message = 'Internal error';
    }
}
exports.InternalError = InternalError;
class DuplicateError {
    message;
    code = 409;
    constructor(message) {
        if (message)
            this.message = message;
        else
            this.message = 'Conflict';
    }
}
exports.DuplicateError = DuplicateError;
class NotFoundError {
    message;
    code = 404;
    constructor(message) {
        if (message)
            this.message = message;
        else
            this.message = 'Not found';
    }
}
exports.NotFoundError = NotFoundError;
class MissingParameterError {
    message;
    code = 400;
    constructor(message) {
        if (message)
            this.message = message;
        else
            this.message = 'Missing parameter';
    }
}
exports.MissingParameterError = MissingParameterError;
class UnauthorizedError {
    message;
    code = 401;
    constructor(message) {
        if (message)
            this.message = message;
        else
            this.message = 'Unauthorized';
    }
}
exports.UnauthorizedError = UnauthorizedError;
class BadRequestError {
    message;
    code = 400;
    constructor(message) {
        if (message)
            this.message = message;
        else
            this.message = 'Bad request';
    }
}
exports.BadRequestError = BadRequestError;
class AuthenticationTimeoutError {
    message;
    code = 419;
    constructor(message) {
        if (message)
            this.message = message;
        else
            this.message = 'Authentication Timeout';
    }
}
exports.AuthenticationTimeoutError = AuthenticationTimeoutError;
//# sourceMappingURL=errors.js.map