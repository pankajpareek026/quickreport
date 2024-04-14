import { statusCode } from "./httpStatusCode.utils.js";

class ApiErrors extends Error {
    constructor(stsCode = statusCode.internalServerError, message = 'internal Server Error', redirectUrl = null, error = true) {
        super();
        this.statusCode = stsCode;
        this.message = message;
        this.redirectUrl = redirectUrl;
        this.error = error;
    }
}

export { ApiErrors };
