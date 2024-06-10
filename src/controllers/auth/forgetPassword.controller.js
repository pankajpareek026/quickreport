import mongoose from "mongoose";
import { UserModel } from "../../models/users.model.js";
import { ApiErrors } from "../../utils/apiErrors.utils.js";
import { ApiRespose } from "../../utils/apiResponse.utils.js";
import { statusCode } from "../../utils/httpStatusCode.utils.js";
import { Message } from "../../utils/responseMessage.utils.js";
import OtpModal from './../../models/otp.model.js';
import generateOTP from './../../utils/otpGenerator.utils.js';
import sendMail from "../../utils/sendMail.utils.js";
import generateResetPassTemplate from "../../../templets/resetPassword.template.js";
// import generateResetPassTemplate from './../../../templets/resetPassword.template.js';

const forgetPassword = async (req, res, next) => {

    try {
        console.log("hitted")
        // get email or username addresss from requiest body
        const { email: emailOrUsername } = req.body
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
        console.log("user Details: ", isValidEmailOrUsername)


        // if user not found
        if (!isValidEmailOrUsername) {
            return next(new ApiErrors(statusCode.notFound, Message.noUserFound));
        }

        // extract email and name from userData
        const { email, name } = await isValidEmailOrUsername;



        // check if user already have forget password opt or not 
        const isOtpExists = await OtpModal.findOne({
            $and: [
                { email: email },
                { validTill: { $gt: Date.now() } }
            ]
        })
        console.log("is otp exist =>", isOtpExists)

        // if email found
        if (isOtpExists?._id) {
            // generate a email template with otp
            const emailTemplate = generateResetPassTemplate(isOtpExists.otp, name)

            //  then send the otp to email to user =>>> (to, subject = "Verify Email", text = `Welcome To Quick Report`, emailContent, otp)
            const mailResult = await sendMail(email, 'Forget Password', 'OTP for reset password', emailTemplate)
            console.log("Mail :=>", mailResult)

            // if any error while delivering mail
            if (mailResult.rejected.length != 0) return next(new ApiErrors())

            // if mail delivered successfully
            return res.status(statusCode.ok).json(new ApiRespose(true, Message.otpSent, `6 Digit OTP sent successfully on your email : ${email}`));
        }
        // if have then send that opt

        // genetate 6 Digit OTP
        const otp = generateOTP()


        // if any error while generating OTP then send an error message
        if (!otp) return next(new ApiErrors(statusCode.internalServerError, Message.wentWrong));


        // store otp in database with userid and otp type linke verification ,reset,forget
        const otpCredentials = {
            email: email,
            owner: isValidEmailOrUsername,
            otpType: 'forget',
            otp: otp,
            validTill: Date.now() + 1000 * 60 * 10
        }
        // generate OTP
        const saveOtp = await OtpModal.create(otpCredentials)

        console.log("saveOtp:>", saveOtp)


        // if any error while saving otp in DB
        if (!saveOtp.id) {
            return next(new ApiErrors(statusCode.internalServerError, Message.internalError))
        }


        // generate a email template with otp
        const emailTemplate = generateResetPassTemplate(otp, name)


        //  then send the otp to email of user =>>> (to, subject = "Verify Email", text = `Welcome To Quick Report`, emailContent, otp)
        const mailResult = await sendMail(email, 'Forget Password', 'OTP for reset password', emailTemplate)
        console.log("mailResult=>", mailResult)


        // if any error while delivering mail
        if (mailResult.rejected.length != 0) return next(new ApiErrors())


        // if mail delivered successfully
        return res.status(statusCode.ok).json(new ApiRespose(true, `OTP sent successfully`, `6 Digit OTP sent successfully on your email : ${email}`));

        // create a otp 
        // save otp
        //send reset password mail to user

        // console.log("result =>", isValidEmailOrUsername)
    } catch (error) {
        // con
        return next(error);
    }
}



// to set new password
const setNewPassword = async (req, res, next) => {
    try {
        // get 
    } catch (error) {

    }
}



export default forgetPassword 