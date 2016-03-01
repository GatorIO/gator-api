var APIError = (function () {
    function APIError(message) {
        this.code = 500;
        if (message)
            this.message = message;
        else
            this.message = 'Unknown error';
    }
    return APIError;
})();
exports.APIError = APIError;
var InternalError = (function () {
    function InternalError(message) {
        this.code = 500;
        if (message)
            this.message = message;
        else
            this.message = 'Internal error';
    }
    return InternalError;
})();
exports.InternalError = InternalError;
var DuplicateError = (function () {
    function DuplicateError(message) {
        this.code = 409;
        if (message)
            this.message = message;
        else
            this.message = 'Conflict';
    }
    return DuplicateError;
})();
exports.DuplicateError = DuplicateError;
var NotFoundError = (function () {
    function NotFoundError(message) {
        this.code = 404;
        if (message)
            this.message = message;
        else
            this.message = 'Not found';
    }
    return NotFoundError;
})();
exports.NotFoundError = NotFoundError;
var MissingParameterError = (function () {
    function MissingParameterError(message) {
        this.code = 400;
        if (message)
            this.message = message;
        else
            this.message = 'Missing parameter';
    }
    return MissingParameterError;
})();
exports.MissingParameterError = MissingParameterError;
var UnauthorizedError = (function () {
    function UnauthorizedError(message) {
        this.code = 401;
        if (message)
            this.message = message;
        else
            this.message = 'Unauthorized';
    }
    return UnauthorizedError;
})();
exports.UnauthorizedError = UnauthorizedError;
var BadRequestError = (function () {
    function BadRequestError(message) {
        this.code = 400;
        if (message)
            this.message = message;
        else
            this.message = 'Bad request';
    }
    return BadRequestError;
})();
exports.BadRequestError = BadRequestError;
var AuthenticationTimeoutError = (function () {
    function AuthenticationTimeoutError(message) {
        this.code = 419;
        if (message)
            this.message = message;
        else
            this.message = 'Authentication Timeout';
    }
    return AuthenticationTimeoutError;
})();
exports.AuthenticationTimeoutError = AuthenticationTimeoutError;
//# sourceMappingURL=errors.js.map