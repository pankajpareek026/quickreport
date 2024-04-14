import { ApiErrors } from "../../utils/apiErrors.utils.js";
import { ApiRespose } from "../../utils/apiResponse.utils.js";
import { statusCode } from "../../utils/httpStatusCode.utils.js";

const forgetPassword = async (req, res, next) => {

    try {
        // console.log(req)
        res.status(statusCode.ok).json(new ApiRespose(true));

    } catch (error) {
        // con
        return new Error(error.message);
    }
}
export default forgetPassword 