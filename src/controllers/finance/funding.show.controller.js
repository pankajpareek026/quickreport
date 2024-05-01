import mongoose from "mongoose";
import FundingModal from "../../models/funding.model.js";
import { ApiRespose } from "../../utils/apiResponse.utils.js";
import { statusCode } from "../../utils/httpStatusCode.utils.js";
import { ApiErrors } from "../../utils/apiErrors.utils.js";
import { Message } from "../../utils/responseMessage.utils.js";


const funding = async (req, res, next) => {
    try {

        // extract user id from request
        const { user: userId } = req.auth


        // get 
        const fundingData = await FundingModal.aggregate([
            { $match: { owner: new mongoose.Types.ObjectId(userId) } },
            {
                $project: {
                    transactions: {
                        $slice: [{ $reverseArray: "$transactions" }, 20]
                    }
                }
            }
        ])
        console.log("funding data :=>", fundingData)

        // if any error while fetching user data
        if (fundingData?.length < 1 || fundingData === null) {
            return next(new ApiErrors(statusCode.badRequest, Message.wentWrong))
        }


        // send response with all transactions
        return res.status(statusCode.ok).json(new ApiRespose(true, "success", fundingData[0].transactions))


    } catch (error) {
        next(error);
    }
}

export default funding
