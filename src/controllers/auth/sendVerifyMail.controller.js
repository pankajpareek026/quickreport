import { ApiRespose } from "../../utils/apiResponse.utils.js";
import { statusCode } from "../../utils/httpStatusCode.utils.js";

const sendVerificationMail = async (req, res, next) => {
    try {
        return res.status(statusCode.ok).json(new ApiRespose())
    } catch (error) {
        next(error);
    }
}

export default sendVerificationMail