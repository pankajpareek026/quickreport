
import path from "path";
// require('events').EventEmitter.defaultMaxListeners = 15; // or set a value that suits your needs

// const csvtojson = require("csvtojson/v2");
// const upload = require("express-fileupload");
// const parseCryptoPair = require("../../utils/parseCryptopair");
// const cloudinary = require("../../utils/cloudinary.utils.js");
import { Axios as axios } from "axios";
import Joi from "joi";
import uploadOnCloudinary from "../utils/uploadFileOnCloudinary.utils.js";
import readFileFromCloudinary from "../utils/readFileFromCloudinary.utils.js";
import convertCsvToJson from "../utils/convertCsvToJson.utils.js";
import convertPriceInUSD from "../utils/convertPriceInUSD.utils.js";
import validateTransactionDataFormate from "../utils/validateTransactionDataFormat.utils.js";
import transactionFormater from "../utils/transactionFormater.utils.js";
import Transaction from "../models/transaction.model.js";
import { ApiErrors } from "../utils/apiErrors.utils.js";
import { statusCode } from "../utils/httpStatusCode.utils.js";


const processUploadedFile = async (req, res, next) => {
    const user = req.auth.user;
    if (!user) {

        const message = "Unauthorized access"
        return next(new ApiErrors(statusCode.badRequest, message, "error"))
    }
    // console.log('file', req.file)
    if (!req.file) {
        return next(new ApiErrors(statusCode.badRequest, "transaction file is required"))
    }
    const maxSize = process.env.MAX_FILE_SIZE;

    const exchangeSchema = Joi.object({
        exchange: Joi.string().valid("BINANCE", "KUCOIN", "BYBIT", "CUSTOM").messages({
            "any.required": "Plese select Transaction Platform",
            "any.only": "unsupported exchange or transaction formate",

        }).required(),
        tag: Joi.string().messages({
            "any.required": "Plese select Transaction Platform",
            "any.only": "unsupported exchange or transaction format",

        }).required(),
        portfolio: Joi.string().default("main").messages({
            "any.required": "Plese select Transaction Platform",
            "any.only": "unsupported exchange or transaction format",

        })

    })
    const { error, value } = exchangeSchema.validate(req.body)
    if (error) {
        const message = error.details[0].message.replace(/[^\w\s]/gi, '')
        return next(new ApiErrors(403, message))
    }

    const { exchange, tag, portfolio } = value
    console.log("valure", value)
    const { mimetype: fileType, filename, size: uploadeFileSize } = req.file;
    // console.log(req.file)

    if (fileType !== "text/csv") {
        return next(new ApiErrors(statusCode.badRequest, "Invalid file type", "error"));
    }
    if (uploadeFileSize > maxSize) {
        return next(
            new ApiErrors(statusCode.badRequest, "file size must not be greater than 2MB", "error")
        );
    }

    // res.send("upload hitted")
    try {
        // upload file on cloudinary server
        const uploadResult = await uploadOncloudinary(req.file.path);
        // if an error is returned
        if (uploadResult.error) {

            return next(new ApiErrors(statusCode.internalServerError, "File Upload failed", "error"))
        }

        const { secure_url: uploadedFileUri } = uploadResult

        const readFileResult = await readFileFromCloudinary(uploadedFileUri)
        if (readFileResult.error) {
            return next(new ApiErrors(statusCode.internalServerError, "something went wrong !", "error"))
        }
        // console.log(readFileResult)

        const csvToJsonResult = await convertCsvToJson(readFileResult);
        if (csvToJsonResult.error) {
            return next(new ApiErrors(statusCode.internalServerError, "something went wrong !", "error"))
        }
        // console.log(csvToJsonResult)
        /**
         * {
          "_id": {
            "$oid": "659c33b25127c73067645d8f"
          },
          "time": "Thu Jan 04 2024 00:34:00 GMT+0530 (India Standard Time)",
          "original_pair": "link/btc",
          "usd_pair": "link/usd",
          "base": "btc",
          "original_price": 0.1,
          "price_in_usd": 14.06471398,
          "order_type": "SELL",
          "coin_units": "55",
          "original_buy_cost": 10,
          "usd_buy_cost": 773.5592689,
          "sell_cost": 0,
          "tag": "NA",
          "comment": "sds",
          "user_id": {
            "$oid": "65965d403a9a7ba97d6845ce"
          },
          "__v": 0
        }
         */



        //         const transactionCollection = csvToJsonResult.map(async (object, index) => {
        //             let symbol = object?.Symbol || object["Spot Pairs"] || object.Pair;
        //             symbol = symbol.toUpperCase();
        //             let time = object["Time(UTC+05:30)"] || object["Filled Time (Local Time)"] || object["Date(UTC)"];
        //             let assetPrice = parseFloat(object?.Price || object["Filled Price"] || object['Avg. Filled Price'])
        //             let filledUnits = parseFloat(object?.Executed || object?.["Filled Quantity"] || object?.['Filled Amount'])
        //             let orderSide = (object?.Side || object?.["Direction"] || object?.Side).toUpperCase();
        //             let buyCost = parseFloat(object?.Amount || object?.["Filled Value"] || object?.['Filled Volume']);

        // const oj={
        //     symbol,time,assetPrice,filledUnits,orderSide,buyCost
        // }
        // console.log(oj)
        //             // // Handle SELL orders
        //             // let sellCost = 0;
        //             // if (orderSide === "SELL" || orderSide === "sell" || orderSide === "Sell") {
        //             //     sellCost = buyCost;
        //             //     buyCost = 0;
        //             //     filledUnits = -filledUnits;
        //             // }

        //             // let coinInfo = await parseCryptoPair(symbol)

        //             // console.log("coininfo=>", coinInfo)
        //             // let usdInfo;
        //             // if (coinInfo.base != "usd") {
        //             //     usdInfo = await convertPriceInUSD(symbol, time)
        //             //     console.log("usd info =>", usdInfo)
        //             // }
        // let newTransactionObj = {
        //     time: time,
        //     usd_pair: usdInfo?.usdPair,
        //     original_pair: symbol,
        //     original_price: assetPrice,
        //     base: coinInfo.base,
        //     price_in_usd: usdInfo?.usdPrice,
        //     order_type: orderSide,
        //     coin_units: filledUnits,
        //     original_buy_cost: buyCost ? buyCost : 0,
        //     usd_buy_cost: buyCost ? filledUnits * usdInfo?.usdPrice : 0,
        //     usd_sell_cost: sellCost ? filledUnits * usdInfo?.usdPrice : 0,
        //     original_sell_cost: sellCost ? sellCost * filledUnits : 0,
        //     user_id: user,
        //     comment: "NA",
        //     tag: "NA"
        // }
        //             // return newTransactionObj
        //             console.log(object)

        //         })
        //         setTimeout(() => {
        //             console.table(transactionCollection)
        //         }, 3000)



        // res.json(uploadResult);

        // const transactionDataSample = await csvToJsonResult[0]

        // check whole file to make sure file contains the expected data to avoid any error in calculation
        const checkWholeFile = async (jsonData, exchange, res) => {
            try {
                const result = await Promise.all(jsonData.map(async (transaction, index) => {

                    // check wether a valid transaction formate or not
                    const isValidFormat = await validateTransactionDataFormate(transaction, exchange);
                    // console.log("is valid formate =>", isValidFormat);
                    // any error while validating the transaction formate
                    if (isValidFormat.error) {
                        // Instead of sending a response here, you can throw an error
                        throw new Error(isValidFormat.message);
                    }
                    // console.log("isvalid formate =>",isValidFormat)

                    return isValidFormat;

                }));
                console.log("result =>>", result);
                return { success: true }

                // Send response after processing all transactions

            } catch (error) {
                // Handle errors here and send an appropriate response
                // return res.json({
                //     type: 'error',
                //     message: error.message,
                // });
                // return next(new ApiErrors(501, error.message))
                throw new Error(error.message);
            }
        };

        // file data validation
        const fileValidation = await checkWholeFile(csvToJsonResult, exchange, res)
        // console.log("fileValidation=>>>>>>", fileValidation)
        if (!fileValidation?.success) {
            return next(new ApiErrors(501, "something Wrong happened !"));
        }
        if (fileValidation.errors) {
            return next(new ApiErrors(401, fileValidation.message));
        }
        // convert all trnsaction data into db acceptable format
        // (transactionData, tag = "NA", userId, portfolio)
        const allTrnsactionsData = await transactionFormater[exchange](csvToJsonResult, tag, user, portfolio)
        // console.log(allTrnsactionsData)
        // res.json(allTrnsactionsData)

        // insert all transactions on database
        const dbResult = await Transaction.insertMany(allTrnsactionsData)
        if (dbResult.length > 0) {
            return res.json({ "type": "success", message: `${dbResult.length} Transaction from '${filename}' added successfully !` })
        }
        res.json(dbResult)
    } catch (error) {
        // console.log(error);
        return next(error);
    }

};

module.exports = processUploadedFile;
