import mongoose from "mongoose";
import { ApiRespose } from "../../utils/apiResponse.utils.js";
import { statusCode } from "../../utils/httpStatusCode.utils.js";
import { ApiErrors } from "../../utils/apiErrors.utils.js";
import Funding from './../../models/funding.model.js';
import { Message } from "../../utils/responseMessage.utils.js";

const transactionInfoFromFunding = async (req, res, next) => {
    try {
        const { transactionId } = req.params
        console.log("quries =>", transactionId)

        console.log("is Transaction Id :", mongoose.isObjectIdOrHexString(transactionId));

        // find out the transactio detail using transaction id in from transactios Array
        const transactionDetail = await Funding.aggregate([
            {
                $unwind: "$transactions"
            },
            {
                $match: {
                    "transactions._id": new mongoose.Types.ObjectId(transactionId)
                }
            },
            {
                $project: {
                    _id: 0,
                    owner: 0,
                    createdAt: 0,
                    updatedAt: 0,

                }

            }
        ])

        // if transaction is not found

        if (!transactionDetail?.length > 0) {
            return next(new ApiErrors(statusCode.badRequest, Message.wentWrong))
        }

        console.log("transaction Data :", transactionDetail)
        res.status(statusCode.ok).json(new ApiRespose(true, "success", [transactionDetail[0]?.transactions]))
    } catch (error) {
        next(error);
    }
}

export default transactionInfoFromFunding
