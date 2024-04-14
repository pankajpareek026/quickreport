// To add funding transactions

import { ApiErrors } from "../../utils/apiErrors.utils.js";
import { statusCode } from "../../utils/httpStatusCode.utils.js";

const addFundingTransaction = async (req, res, next) => {
    // let { amount, type, discription, date,currency } = req.body;

    try {
        const user = req.auth.user
        console.log("user req", user)
        const isValidUser = await User.findOne({ _id: user }, { _id: 1 })
        if (!isValidUser) {
            return next(new ApiErrors(statusCode.unauthorized, "unauthorized access"));
        }


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

        const { error, value } = validationSchema.validate(req.body)
        if (error) {
            const message = error.details[0].message
            // .replace(/[^\w\s]/gi, '')
            console.log(error)
            return next(new ApiErrors(statusCode.badRequest, message,))

        }
        // let { amount, type, discription, date } = req.body;
        let { amount, type, discription, date, note, currency } = value

        // Convert withdraw amount to negative
        if (type === 'withdraw' || type === "WITHRDAW") {
            amount = -amount;
        }

        const fundingResult = await Funding.create({
            amount, type, amount, note, currency, user_id: user
        })
        if (!fundingResult._id) {
            return next(error)
        }
        // Respond with JSON data for now
        return res.status(statusCode.ok).json(new ApiResponse(true, 'transaction saved successfully'));

    } catch (error) {
        return next(error)
    }
};

export default addFundingTransaction