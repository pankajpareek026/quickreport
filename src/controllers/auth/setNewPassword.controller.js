import Joi from "joi"
import { UserModel } from "../../models/users.model.js"
import { ApiErrors } from "../../utils/apiErrors.utils.js"
import { ApiRespose } from "../../utils/apiResponse.utils.js"
import { statusCode } from "../../utils/httpStatusCode.utils.js"
import Otp from "../../models/otp.model.js"
import { compare, hash } from 'bcrypt'
import mongoose from "mongoose"
import { log } from "console"

const setNewPassword = async (req, res, next) => {
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
            requestId: Joi.string().required().messages({
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


        //    find otp with request id
        const otpData = await Otp.findOne({ _id: value.requestId })
        console.log("otp data =>", otpData)
        if (otpData == null) {
            return next(new ApiErrors(statusCode.badRequest, "OTP expired please try again !"));

        }

        // check validate otp 

        // if otp is invalid 
        if (otpData.otp != value.otp) {
            return next(new ApiErrors(statusCode.badRequest, "Invalid OTP!"))
        }


        // get user data by email to prevent user to set existing password again

        const userData = await UserModel.findOne({ email: otpData.email });
        log("user details=>", userData);
        const hashedPassword = await hash(value.newPassword, 10);


        // if  current password is same as previous password
        const isSamePassword = await compare(value.newPassword, userData.password)
        log("is seme pass => ", isSamePassword);

        if (isSamePassword) {
            return next(new ApiErrors(statusCode.badRequest, "Old password and new password can't be same !"));
        }

        // set new password 


        // hash password

        const updatePasswordResult = await UserModel.updateOne({
            email: otpData.email
        }, {
            $set: { password: hashedPassword }
        });

        // if any error while saving password 
        if (!updatePasswordResult) {
            return next(new ApiErrors(statusCode.internalServerError, "somethig went wrong, try again later"))
        }

        return res.status(statusCode.created).json(new ApiRespose(true, "Password updated successfully ", "/login"))










    } catch (error) {
        console.error(error.message);

        return next(new Error(error.message));
    }
}


export default setNewPassword