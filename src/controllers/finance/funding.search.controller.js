import mongoose from "mongoose";
import { ApiRespose } from "../../utils/apiResponse.utils.js";
import { statusCode } from "../../utils/httpStatusCode.utils.js";
import { Message } from "../../utils/responseMessage.utils.js";
import FundingModal from './../../models/funding.model.js';

const fundingSearch = async (req, res, next) => {
    try {
        // extract user id from request
        const { user: userId } = req.auth
        console.log("query :=>", req.query)

        //  get seact query from request
        const { query } = req.query

        // get all transactions which match the query
        const regexPattern = /^[-+]?\d+(\.\d+)?$/;

        const result = await FundingModal.find({
            owner:userId,
            "transactions": {
                $elemMatch: {
                    amount: 11
                }
            }
        })



        res.status(statusCode.ok).json(new ApiRespose(true, Message.success, result))
    } catch (error) {
        next(error);
    }
}

export default fundingSearch
