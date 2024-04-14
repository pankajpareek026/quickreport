import { User } from "../../models/users.model.js";
import { statusCode } from "../../utils/httpStatusCode.utils.js";

const verifyEmail = async (req, res, next) => {
    try {
        console.log(req.headers)
        const user = req.auth.user
        const isValidUser = await User.findOne({ _id: user }, { _id: 1 })
        if (!isValidUser) {
            return next(new ApiErrors(statusCode.unauthorized, "unauthorized access"));
        }
    } catch (error) {
        console.log(error.message);
        // return next(error);
        return new Error(error.message)
    }
}

export default verifyEmail