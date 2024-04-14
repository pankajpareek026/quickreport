/* To add Transaction in portfolio */

import Joi from "joi";
import { ApiErrors } from "../../utils/apiErrors.utils.js";
import { statusCode } from "../../utils/httpStatusCode.utils.js";
import { ApiRespose } from "../../utils/apiResponse.utils.js";

// const ApiErrors = require("../../utils/apiErrors.utils.js");
const addPortfolioTransaction = async (req, res, next) => {
    try {
        const user = req.auth.user;
        const validationSchema = Joi.object({
            coinName: Joi.string()
                .regex(/^[^\d]+$/)
                .label('Username')
                .messages({
                    "string.pattern.base": `invalid coin name`,
                    "string.empty": `coinname is required`,
                    "any.required": `coinname is required`,
                }).required(),

            orderType: Joi.string().valid("SELL", "BUY").label("'order type'").required().messages({
                "string.valid": "order type must be BUY or SELL"
            }),

            price: Joi.number().min(0.00000001).max(1000000000000).label("'coin price'").messages({
                "number.min": "Coin Price Must be Greater than zero",
                "number.max": "Coin Price Must be Less than 10000000000000000"
            }).required(),

            date: Joi.date().label("'order date'").required().max(Date.now()).greater("01-02-2009").messages({
                "date.min": "Order date-time must be older OR equal to curret date date-time",
                "date.greater": `Order date-time must greater than ${new Date("01-02-2009,06:00:00")}`,
            }),

            units: Joi.number().min(0.00000001).max(1000000000000000).label("'coin unit'").messages({
                "number.min": "Coi Must be Greater than zero",
                "number.max": "Coin Units Must be Less than 10000000000000000",
                "number.empty": "Coin Unit is Required",
            }).required(),

            totalCost: Joi.number().min(0.00000001).max(1000000000000000).label("'total cost'").messages({
                "number.min": "Total Cost Must be Greater than zero",
                "number.max": "Total Cost Must be Less than 10000000000000000",
                "number.empty": "Total Cost is required"
            }).required(),
            note: Joi.string(),
            tag: Joi.string()  // Allaow an empty string for the note
        });

        if (!user) {
            const message = "Unauthorized access"
            return next(new ApiErrors(statusCode.unauthorized, message, "error"))
        }



        const { error, value } = validationSchema.validate(req.body);
        console.log("value =>", value)
        if (error) {

            const message = error.details[0].message.replace(/[^\w\s]/gi, '')
            return next(new ApiErrors(statusCode.badRequest, message, "error"))
        }





        let { coinName, orderType, price, date, units, totalCost, note, tag } = value;
        let sellCost;

        // ... (rest of your code)


        // TODO: Complete the database operation for adding the transaction
        // const transactionAddResult = await someAsyncOperation();
        // Send a success response
        let coinInfo = await parseCryptoPair(value.coinName)

        console.log("coininfo=>", coinInfo)
        let usdInfo;
        if (coinInfo.base != "usd") {
            usdInfo = await convertPriceInUSD(coinName, date)
            console.log("usd info =>", usdInfo)
        }
        const transactionData = {
            time: date,
            usd_pair: usdInfo.usdPair,
            original_pair: usdInfo.originalPair,
            original_price: price,
            base: coinInfo.base,
            symbol: coinInfo.symbol,
            coin_id: coinInfo.coinId,
            price_in_usd: usdInfo.usdPrice,
            order_type: orderType,
            coin_units: units,
            original_buy_cost: totalCost,
            usd_buy_cost: units * usdInfo.usdPrice,
            sell_cost: sellCost,
            user_id: user._id,
            comment: note,
            sell_cost: sellCost,
            user_id: user,
            comment: note,
            tag: tag
        }
        const addTransactionDbResult = await Transaction.create(transactionData)
        console.log("addTransactionDbResult =>", addTransactionDbResult)
        const { _id: transactionId } = addTransactionDbResult
        if (!transactionId) {
            console.log("Tid =>", transactionId)
            return next(new ApiErrors(statusCode.internalServerError, "something went wrong ! if 136"))
        }


        res.status(statusCode.ok).json(new ApiRespose(true, 'Transaction added successfully'));

    } catch (error) {
        // Handle database operation errors
        console.error('Error in addBuySellTransaction:', error);
        // res.status(500).json({
        //     message: 'Internal Server Error',
        //     title: "error",
        //     type: "error",
        //     actual_error: error.message
        // });
        return next(error)
    }
};

export default addPortfolioTransaction