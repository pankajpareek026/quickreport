import { User } from "../../models/users.model.js";
import { ApiRespose } from "../../utils/apiResponse.utils.js";
import { statusCode } from "../../utils/httpStatusCode.utils.js";

const deleteTransactionFromFunding = async (req, res, next) => {
    try {
        const user = req.auth.user
        const isValidUser = await User.findOne({ _id: user }, { _id: 1 })
        if (!isValidUser) {
            return next(new ApiErrors(statusCode.unauthorized, "unauthorized access"));
        }
    } catch (error) {
        return next(error);
    }
}

export default deleteTransactionFromFunding
