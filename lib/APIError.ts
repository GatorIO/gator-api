//  A base error class.  All other error classes are based on this class.

class APIError {
    message: string;
    code: number = 500;

    constructor (message?: string) {

        if (message)
            this.message = message;
        else
            this.message = 'Internal error';
    }
}

export = APIError;