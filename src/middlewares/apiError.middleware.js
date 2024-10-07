import { ApiErrors } from "../utils/apiErrors.utils.js";
import { config } from "../../config/config.js";

const ErrorHandler = (error, req, res, next) => {
    // const message = error.message || "Internal Server Error";
    const statusCode = error.statusCode || 500;

    if (error instanceof ApiErrors) {
        // Handle custom error
        return res.status(statusCode).json({
            error: true,
            message: error.message,
        });
    } else {
        // Handle other types of errors
        const responsePayload = {
            type: "error",
            message: config.debugMode ? error.message : "Internal Server Error",
            Error: config.debugMode ? error : []
        };



        res.status(statusCode).json(responsePayload);
    }
};

export default ErrorHandler;
