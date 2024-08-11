import Joi from "joi"
import { UserModel } from "../../models/users.model.js"
import { ApiErrors } from "../../utils/apiErrors.utils.js"
import { ApiRespose } from "../../utils/apiResponse.utils.js"
import { statusCode } from "../../utils/httpStatusCode.utils.js"

const setNewPassword = (req, res, next) => {
    try {
        console.log("req recived =>", req.body)
        const changeOtpSchema = Joi.object({
            otp: Joi.string().length(6).required().messages({
                'string.base': 'Invalid OTP!',
                'string.length': 'Invalid OTP! It must be 6 digits long.',
                'any.required': 'OTP is required!',
            }),
            newPassword: Joi.string().min(8).required().messages({
                'string.base': 'Please enter a new password!',
                'string.min': 'Password must be at least 8 characters long!',
                'any.required': 'New password is required!',
            }),
            email: Joi.string().email().message({
                "any.required": 'somthing went wrong please try again later'
            })
        });

        const { error, value } = changeOtpSchema.validate(req.body);

        console.log("error =>", error);
        if (error) {
            console.log(error);
            // res.status(statusCode.badRequest)
            return next(new ApiErrors(statusCode.badRequest, error.message))
        }


        // read otp and new password from reques 



        // check  is otp valid 

        // check is new password is equal to  old password 

        // change password 

        // send success respose
        return res.status(statusCode.ok).json(new ApiRespose(true, 'success', value))


    } catch (error) {
        console.log(error.message);

        return next(new Error(error.message));
    }
}


export default setNewPassword