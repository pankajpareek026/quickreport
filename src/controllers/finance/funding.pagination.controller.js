import mongoose from "mongoose";
import { ApiErrors } from "../../utils/apiErrors.utils.js";
import { ApiRespose } from "../../utils/apiResponse.utils.js";
import { statusCode } from "../../utils/httpStatusCode.utils.js";
import { Message } from "../../utils/responseMessage.utils.js";
import FundingModal from './../../models/funding.model.js';

const fundingPaggination = async (req, res, next) => {
    try {
        // extract user id from request
        const { user: userId } = req.auth


        //  extract  params from request 
        let { start, end, pageLimit } = req.params
        start = parseInt(start)
        end = parseInt(end)
        pageLimit = parseInt(pageLimit)// pageLimit means No. of transactions per page

        console.log("transactions par page :=> ", end - start)

        // if not a  invalid pagelimit
        if ((end - start != pageLimit)) {
            return next(new ApiErrors(statusCode.badRequest, Message.unableToProcess))
        }

        // get transaction between given limit
        const result = await FundingModal.aggregate([
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(userId)
                }
            }, {
                $project: {
                    _id: 0,
                    transactions: {
                        $slice: [
                            { $reverseArray: "$transactions" }, start, end  // here start and end are transaction nuber this will return transactions between start and end
                        ]
                    }
                }
            }
        ])


        console.log("transactionData :=>", result)


        // if modified transactions
        const transactions = result[0]?.transactions?.length > 0 ? result[0]?.transactions : null

        // send success message with transaction data
        res.status(statusCode.ok).json(new ApiRespose(true, "success", transactions))


    } catch (error) {
        next(error);
    }
}

export default fundingPaggination
