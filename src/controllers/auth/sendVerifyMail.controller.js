import Otp from "../../models/otp.model.js";
import { User } from "../../models/users.model.js";
import { ApiErrors } from "../../utils/apiErrors.utils.js";
import { ApiRespose } from "../../utils/apiResponse.utils.js";
import { statusCode } from "../../utils/httpStatusCode.utils.js";
import generateOTP from "../../utils/otpGenerator.utils.js";
import generateVerifyEmailTemplate from '../../../templets/verifyEmail.template.js';
import sendMail from "../../utils/sendMail.utils.js";
import { Message } from "../../utils/responseMessage.utils.js";

const sendVerificationMail = async (req, res, next) => {
    try {
        const { user: userId } = req.auth
        // console.log("user=>", req.auth)

        const userInfo = await User.findOne({ _id: userId }) // find out the user by userid

        // if user not found then send error message 
        if (!userInfo) {
            return next(new ApiErrors(statusCode.badRequest, Message.unAuth))
        }


        // parse email and verification status from user info
        const { _id, email, isVerified, name } = userInfo


        // if user veried then redirect to the dashboard
        if (isVerified) {
            return res.status(statusCode.ok).json(new ApiRespose(true, "verified user", null, '/dashboard'))
        }


        // check if OTP already exists then send that otp again 
        const otpExists = await Otp.findOne({ owner: _id, validTill: { $gt: Date.now() } })
        console.log("Otp already exists =>", otpExists)

        // if exists then send otp again
        if (otpExists) {
            // generate a email template with otp
            const emailTemplate = generateVerifyEmailTemplate(otpExists.otp, name)

            //  then send the otp to email to user =>>> (to, subject = "Verify Email", text = `Welcome To Quick Report`, emailContent, otp)
            const mailResult = await sendMail(email, 'Verify email', 'welcome to quick report', emailTemplate)
            console.log("Mail :=>", mailResult)

            // if any error while delivering mail
            if (mailResult.rejected.length != 0) return next(new ApiErrors())

            // if mail delivered successfully
            return res.status(statusCode.ok).json(new ApiRespose(true, Message.otpSent, `6 Digit OTP sent successfully on your email : ${email}`));
        }

        // genetate 6 Digit OTP
        const otp = generateOTP()


        // if any error while generating OTP then send an error message
        if (!otp) return next(new ApiErrors(statusCode.internalServerError, Message.wentWrong));


        // store otp in database with userid and otp type linke verification ,reset,forget
        const otpCredentials = {
            email: email,
            owner: userInfo._id,
            otpType: 'verify',
            otp: otp,
            validTill: Date.now() + 1000 * 60 * 10
        }
        // generate OTP
        const saveOtp = await Otp.create(otpCredentials)

        console.log("saveOtp:>", saveOtp)
        // if any error while saving otp in DB
        if (!saveOtp.id) {
            return next(new ApiErrors(statusCode.internalServerError, Message.internalError))
        }
        // generate a email template with otp
        const emailTemplate = generateVerifyEmailTemplate(otp, name)

        //  then send the otp to email of user =>>> (to, subject = "Verify Email", text = `Welcome To Quick Report`, emailContent, otp)
        const mailResult = await sendMail(email, 'Verify email', 'welcome to coinVyas', emailTemplate)
        console.log("mailResult=>", mailResult)
        // if any error while delivering mail
        if (mailResult.rejected.length != 0) return next(new ApiErrors())

        // if mail delivered successfully
        return res.status(statusCode.ok).json(new ApiRespose(true, `OTP sent successfully`, `6 Digit OTP sent successfully on your email : ${email}`));

    } catch (error) {
        next(new Error(error.message));
    }
}

export default sendVerificationMail