import { ApiRespose } from "../../utils/apiResponse.utils.js";
import { statusCode } from "../../utils/httpStatusCode.utils.js";

const sendVerificationMail = async (req, res, next) => {
    try {
        console.log("user=>", req.user)
        return res.status(statusCode.ok).json(new ApiRespose(req.auth))
    } catch (error) {
        next(new Error(error.message));
    }
}

export default sendVerificationMail