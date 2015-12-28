var APIError = (function () {
    function APIError(message) {
        this.code = 500;
        if (message)
            this.message = message;
        else
            this.message = 'Internal error';
    }
    return APIError;
})();
module.exports = APIError;
//# sourceMappingURL=APIError.js.map