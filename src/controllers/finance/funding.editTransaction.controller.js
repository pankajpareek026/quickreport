import { ApiErrors } from "../../utils/apiErrors.utils.js";
import { ApiRespose } from "../../utils/apiResponse.utils.js";
import { statusCode } from "../../utils/httpStatusCode.utils.js";
import { Message } from "../../utils/responseMessage.utils.js";
import Funding from './../../models/funding.model.js';
import Joi from "joi";

const editTransactionFromFunding = async (req, res, next) => {
    try {
        // res.status(statusCode.ok).json(new ApiRespose())

        // parse transactio id from params
        const { transactionId } = req.params

        // parse data from request.body
        const data = req.body
        console.log("request Data =>", data)
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
        const { error, value } = validationSchema.validate(req.body)

        console.log("Valid Data =>", value)


        // if any data validation falils then send error message
        if (error) {
            const message = error.details[0].message
            // .replace(/[^\w\s]/gi, '')
            console.log(error)
            return next(new ApiErrors(statusCode.badRequest, message,))
        }


        // update transaction 
        const updateResult = await Funding.updateOne(
            { "transactions._id": transactionId }, // Match documents containing the specific transaction
            {
                $set: {

                    "transactions.$[elem].amount": value.amount,
                    "transactions.$[elem].currency": value.currency,
                    "transactions.$[elem].type": value.type,
                    "transactions.$[elem].date": value.date,
                    "transactions.$[elem].note": value.note,
                    "transactions.$[elem].tag": value.tag,

                }
            },
            { arrayFilters: [{ "elem._id": transactionId }] } // Specify the array filter for the positional operator
        )


        // if any error while updating transaction 
        if (updateResult?.modifiedCount != 1) {
            return next(new ApiErrors(statusCode.badRequest, Message.wentWrong))
        }
        console.log("update Result =>", updateResult)
        return res.status(statusCode.ok).json(new ApiRespose(true, Message.trnsUpdated,))

    } catch (error) {
        next(error);
    }
}

export default editTransactionFromFunding
