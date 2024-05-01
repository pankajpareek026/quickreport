import { UserModel } from "../../models/users.model.js";
import { ApiErrors } from "../../utils/apiErrors.utils.js";
import { ApiRespose } from "../../utils/apiResponse.utils.js";
import { statusCode } from "../../utils/httpStatusCode.utils.js";
import { Message } from "../../utils/responseMessage.utils.js";

const forgetPassword = async (req, res, next) => {

    try {
        console.log("hitted")
        // get email or username addresss from requiest body
        const {email:emailOrUsername} = req.body
        console.log("emailOrUsername >", req.body)
        if (!emailOrUsername) {
            return next(new ApiErrors(statusCode.badRequest, "email or username is required"));
        }
        // search user in database
        const isValidEmailOrUsername = await UserModel.findOne({
            $or: [
                {
                    email: emailOrUsername
                },
                {
                    username: emailOrUsername
                }
            ]
        })

        // if user not found
        if (!isValidEmailOrUsername) {
            return next(new ApiErrors(statusCode.notFound, Message.noUserFound));
        }
console.log("result =>",isValidEmailOrUsername)
    } catch (error) {
        // con
        return new Error(error.message);
    }
}
export default forgetPassword 