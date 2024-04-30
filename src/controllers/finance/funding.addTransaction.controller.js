// To add funding transactions

import Joi from "joi";
import Funding from "../../models/funding.model.js";
import { User } from "../../models/users.model.js";
import { ApiErrors } from "../../utils/apiErrors.utils.js";
import { statusCode } from "../../utils/httpStatusCode.utils.js";
import mongoose from "mongoose";
import { ApiRespose } from "../../utils/apiResponse.utils.js";

const addFundingTransaction = async (req, res, next) => {
    // let { amount, type, discription, date,currency } = req.body;

    try {
        // extract user id from request
        const { user: userId } = req.auth

        console.log("user req =>", userId)
        // const isValidUser = await User.findOne({ _id: user }, { _id: 1 })
        console.log("user =>", userId)
        // const { _id: userId } = isValidUser;


        // if userId not exists send error message
        if (!userId) {
            return next(new ApiErrors(statusCode.unauthorized, "unauthorized access"));
        }

        // validate user data
        const validationSchema = Joi.object({
            amount: Joi.number().min(1).max(1000000000000).label("'Amount'").messages({
                "number.min": "Amount Must be Greater than zero",
                "number.empty": "Amount is required",
                "any.required": "Amount is required",
                "number.max": "Amount Must be Less than 10000000000000000"
            }).required(),
            type: Joi.string().label("Transaction Type").valid("DEPOSIT", "deposit", "withdraw", "WITHDRAW").label("'Transaction Type'").required().messages({
                "any.only": "order type must be Deposit or Withdraw",
            }),
            discription: Joi.string(),
            currency: Joi.string().required().messages({
                "any.required": "Currency Type is Required",
            }),
            date: Joi.date().label("'order date'").required().messages({
                "date.min": "Order date-time must be older OR equal to curret date date-time",
                "date.base": "Date and Time is required",
                "date.greater": `Order date-time must greater than ${new Date("01-02-2009,06:00:00")}`,
                "any.required": `Date and Time is required`,
            }),
            tag: Joi.string(),
            note: Joi.string().messages({
                "any.required": "note/comment is required"
            }).required() // Allaow an empty string for the note
        });

        // extract error and valid data 
        const { error, value: validData } = validationSchema.validate(req.body)

        console.log("Valid Data =>", validData)
        // if any data validation falils then send error message
        if (error) {
            const message = error.details[0].message
            // .replace(/[^\w\s]/gi, '')
            console.log(error)
            return next(new ApiErrors(statusCode.badRequest, message,))
        }

        //  extract data from valid data
        let { amount, type, discription, date, note, currency } = validData

        console.log("valid data =>", validData)
        // Convert withdraw amount to negative
        if (type === 'withdraw' || type === "WITHRDAW") {
            amount *= -1;
        }

        // create a finala transaction data with owner and object id
        const transactionData = await {
            you: "1010",
            owner: userId,
            _id: new mongoose.Types.ObjectId(),
            amount,
            type,
            discription,
            date,
            note,
            currency
        }


        //  save data in database
        const fundingResult = await Funding.updateOne({ owner: userId }, {
            $push: { transactions: transactionData }
        })

        console.log("transaction result =>", fundingResult)


        // Respond with JSON data for now
        return res.status(statusCode.ok).json(new ApiRespose(true, 'Transaction saved successfully',));

    } catch (error) {
        return next(error)
    }
};

export default addFundingTransaction