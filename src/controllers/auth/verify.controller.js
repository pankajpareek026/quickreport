import Joi from "joi";
import Otp from "../../models/otp.model.js";
import { User } from "../../models/users.model.js";
import { ApiRespose } from "../../utils/apiResponse.utils.js";
import { statusCode } from "../../utils/httpStatusCode.utils.js";
import { ApiErrors } from "../../utils/apiErrors.utils.js";
import verifyOTP from "../../utils/verifyOTP.utils.js";
import Portfolio from './../../models/portfolio.model.js';
import AssetSpace from "../../models/assetSpace.model.js";
import Funding from "../../models/funding.model.js";
import { Message } from "../../utils/responseMessage.utils.js";

const verifyEmail = async (req, res, next) => {
    try {
        // console.log(req.body)
        const { user: userId } = req.auth
        // get OTP from req
        const { otp: requestOtp, type: otpType } = req.body

        //  validate otp value and otptype
        const otpSchema = Joi.object({
            value: Joi.number().min(100000).max(999999).required().error(new Error("Invalid OTP")),
            type: Joi.string().valid('verify', 'reset', 'forget').required().error(new Error('something went wrong . try again')),
        })

        const { error, value: requestData } = otpSchema.validate(req.body)
        console.log("req ERROR :>", error,)

        // if any error while validating otp data then send error message
        if (error) {

            return next(new ApiErrors(statusCode.badRequest, error?.message))
        }

        // call otp verifier funtion 
        const verificationResult = await verifyOTP(userId, requestData.value, requestData.type)
        // console.log("verificationResult>", verificationResult)

        // if otp not match with database result
        if (!verificationResult.valid) {
            return next(new ApiErrors(statusCode.badRequest, Message.wOtp))
        }


        // if match then update user isVerified =true 
        const setVerified = await User.updateOne({ _id: userId }, {
            $set: {
                isVerified: true
            }
        })

        console.log("setVerified=>", setVerified)
        // check is user verification status updated successfully if not then send error message
        if (setVerified.modifiedCount !== 1) {
            return next(new ApiErrors(statusCode.internalServerError, Message.wentWrong))

        }
        console.log(" 1. email verified 1/5 ")

        // delete otp if user verificatio status changed successfully
        const deleteOTP = await Otp.deleteOne({ owner: userId, otpType: 'verify' });


        // if OTP not deleted successfully
        if (deleteOTP.deletedCount !== 1) return next(new ApiErrors(statusCode.internalServerError, Message.wentWrong))
        console.log('OTP deleted successfully= >', deleteOTP)


        // create main PortFolio
        const portfolioResult = await Portfolio.create({ owner: userId, name: "main" })


        //any error while creating portfolio return error message
        if (!portfolioResult._id) return next(new ApiErrors(statusCode.internalServerError, Message.wentWrong));
        console.log(" 2. portfolio created 2/5")
        console.log("portfolio ID :", portfolioResult._id)


        // create asset space
        const assetSpaceResult = await AssetSpace.create({
            owner: userId,
            name: "main"
        })
        console.log("3. assset space created 3/5")
        console.log("Asset Space ID :> " + assetSpaceResult._id)


        // if any error while creating asset space retuen error message
        if (!assetSpaceResult._id) return next(new ApiErrors(statusCode.internalServerError, Message.wentWrong))


        // create funding 
        const fundingResult = await Funding.create({ owner: userId });
        console.log("4. funding created 4/5 ")
        console.log("Funding ID :=> " + fundingResult._id);

        // if any error while creating funding retuen error message
        if (!fundingResult._id) return next(new ApiErrors(statusCode.internalServerError, Message.wentWrong));

        console.log("5. Account set Completed 5/5")
        // if user user isVerified update successfully create funding and portfolio(main) and asset space (main)
        // const isValidUser = await User.findOne({ _id: user }, { _id: 1 })
        // if (!isValidUser) {
        //     return next(new ApiErrors(statusCode.unauthorized, "unauthorized access"));
        // }


        return res.status(statusCode.created).json(new ApiRespose(true, Message.acSetupDone, null, '/dashboard'));
    } catch (error) {
        console.log(error.message);
        // return next(error);
        return next(new Error(error.message));
    }
}

export default verifyEmail