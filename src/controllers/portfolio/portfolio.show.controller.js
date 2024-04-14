import { ApiRespose } from "../../utils/apiResponse.utils.js";
import { statusCode } from "../../utils/httpStatusCode.utils.js";

const portfolio = async (req, res, next) => {
    try {
        res.status(statusCode.ok).json(new ApiRespose())
    } catch (error) {
        next(error);
    }
}

export default portfolio
