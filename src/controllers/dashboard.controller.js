const cnn = require("../db/connection");
const mongoose = require("mongoose");
const Portfolio = require("../models/portfolio.model");
const Transaction = require("../models/transaction.model");
const ApiErrors = require("../utils/apiErrors.utils");
const createCoinIdString = require("../utils/createCoinIdString");
const { default: axios, all } = require("axios");
const getCoinInfo = require("../utils/getCoinInfo.utils");


const dashboard = async (req, res, next) => {

    const user = req.auth.user;
    const userId = new mongoose.Types.ObjectId(user)

    const portfolioName = req.body.portfolio ? req.body.portfolio : "main"
    console.log("username :", user)
    try {


        console.log("DB operation is running......... [1/7]")
        const transactionsResult = await Transaction.aggregate([
            {
                $match: {
                    $and: [
                        {
                            user_id: userId,
                        },
                        // {
                        //     portfolio: portfolioName,
                        // },
                    ],
                },
            },
            {
                $group: {
                    _id: "$coin_id",
                    totalTransactions: {
                        $sum: 1,
                    },
                    totalBuyCostUSD: {
                        $sum: "$usd_buy_cost",
                    },
                    totalSellCostUSD: {
                        $sum: "$usd_sell_cost",
                    },
                    holding: {
                        $sum: "$coin_units",
                    },
                    averagePriceUSD: {
                        $avg: { $cond: [{ $eq: ["$order_type", "Buy"] }, "$price_in_usd", null] },
                    },
                    transactionData: {
                        $push: "$$ROOT",
                    },
                },
            },

        ])

        if (transactionsResult.length < 1) {
            return res.status(200).json(
                {
                    data: null,
                    message: "Transaction not found !"
                }
            )
        }
        console.log("Parssig coinIds [2/7]")
        const coinIdsArray = transactionsResult.map((data) => {
            return data._id
        })
        console.log("Creating coinId string.........[3/7]")
        const coinIdsString = createCoinIdString(coinIdsArray);


        // console.log("coinIdsString =>", coinIdsString)
        console.log("Fetchig coins current Price.........[4/7]")
        let currentPriceData = await axios(`https://api.coingecko.com/api/v3/simple/price?ids=${coinIdsString}&vs_currencies=btc%2Ceth%2Cinr%2Cusd`);
        // console.log("currentPriceData->", currentPriceData.data)
        currentPriceData = await currentPriceData.data
        // console.log("result =>", result,);


        console.log("Fetchig coins symbol and logos .........[5/7]")
        const logoAndSymbol = await getCoinInfo(coinIdsString)
        console.log(logoAndSymbol)


        // formate current price array 
        const parsedIdsFromCurrentPriceData = Object.keys(currentPriceData)
        // console.log("parsedIdsFromCurrentPriceData", parsedIdsFromCurrentPriceData)

        const finalCurrentPriceData = []; //final data of the current price with coinIds from currentPriceData

        console.log("Changing Curretn Price Formate.........[6/7]")

        // Iterate over each parsed ID from the current price data
        for (let i = 0; i < parsedIdsFromCurrentPriceData.length; i++) {
            const coinId = parsedIdsFromCurrentPriceData[i];
            const coinData = currentPriceData[coinId];

            // Create a new object with structured data
            const newData = {
                coinId,
                usdCurrentPrice: coinData.usd,
                btcCurrentPrice: coinData.btc,
                ethCurrentPrice: coinData.eth,
                ...coinData  // Spread any other properties from the original data
            };
            // Add the new data to the finalCurrentPriceData array
            finalCurrentPriceData.push(newData);
        }


        const p = []



        console.log("calculating PNL.........[7/7]")
        let totalInvested = 0, totalCurrentValue = 0
        const plnInfo = await transactionsResult.map((data, index) => {
            const { holding, totalBuyCostUSD, totalSellCostUSD, averagePriceUSD } = data;
            let allData = {}


            finalCurrentPriceData.forEach(({ coinId, usdCurrentPrice }, index) => {
                p.push({ coinId: coinId, _id: data._id })

                if (data._id == coinId) {

                    for (const coinInfo of logoAndSymbol) {
                        console.log("coinInfo =>>", coinInfo)
                        if (coinId == coinInfo.id) {
                            allData.symbol = coinInfo.symbol
                            allData.logo = coinInfo.image
                        }
                    }
                    // console.log("true")
                    allData.currentPrice = usdCurrentPrice
                    allData.currentValue = parseFloat(holding * usdCurrentPrice)
                    totalCurrentValue += parseFloat(holding * usdCurrentPrice)
                    totalInvested += parseFloat(totalBuyCostUSD - totalSellCostUSD)
                    if (holding > 0) {
                        allData.pnlInUsd = parseFloat(((holding * usdCurrentPrice) + totalSellCostUSD) - totalBuyCostUSD)
                        allData.pnlInPercentage = parseFloat(((((holding * usdCurrentPrice) + totalSellCostUSD) - totalBuyCostUSD) / totalBuyCostUSD) * 100)
                    }
                    else {
                        allData.pnlInPercentage = parseFloat(((totalSellCostUSD - totalBuyCostUSD) / totalBuyCostUSD) * 100)
                        allData.pnlInUsd = parseFloat(totalSellCostUSD - totalBuyCostUSD);
                    }
                }



            });
            // console.log("allData", allData)
            allData = { ...data, ...allData };
            return allData
        })
        // get logo and symbol using coinId



        console.table(plnInfo)
        res.json({
            totalCurrentValue,
            totalInvested,
            plnInfo
        })



    } catch (error) {
        next(error);
    }

}

const createNewPortfolio = async (req, res, next) => {
    const user = req.auth.user;

    try {
        if (!user) {

            const message = "Unauthorized access"
            return next(new ApiErrors(400, message, "error"))
        }
        const { name: porifolioName } = req.body
        if (!porifolioName) {
            return next(new ApiErrors(403, "portfolio name is required"))
        }
        const isPortfolioExists = await Portfolio.findOne({ name: porifolioName })
        console.log("exists ->", isPortfolioExists)
        if (isPortfolioExists) {
            return next(new ApiErrors(409, `portfolio '${porifolioName}' already exists`))
        }

        const newPortfolio = await Portfolio.create({ name: porifolioName, user_id: user });
        console.log("np=>", newPortfolio)
        if (newPortfolio._id) {
            return res.status(200).json({
                type: 'success',
                message: `Portfolio ${porifolioName} created successfully`
            })
        }

        return next(new ApiErrors(501))

    } catch (error) {
        return next(error)
    }
}

module.exports = {
    dashboard,
    createNewPortfolio
}