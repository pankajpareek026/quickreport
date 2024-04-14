import { ApiErrors } from "../../utils/apiErrors.utils.js"
import { ApiRespose } from "../../utils/apiResponse.utils.js"
import { statusCode } from "../../utils/httpStatusCode.utils.js"

const resetPassword = async (req, res, next) => {
    try {
        return res.status(statusCode.ok).json(new ApiRespose())
    } catch (error) {
        return next(new ApiErrors(statusCode.internalServerError, error.message))
    }
}
export default resetPassword



