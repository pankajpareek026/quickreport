// const convertPriceInUSD = require("./convertPriceInUSD.utils");

// async function CUSTOM(transactionData, tag = "NA", userId, portfolio) {
//     const coinids = [];
//     try {

//             const original_price = parseFloat(data["price"]);
//             const { base, newPair, coinId } = parseCryptoPair(data["pair"]);
//             const originalPair = data["pair"]
//             let orderSide = data["side"]
//             orderSide = orderSide.toUpperCase();
//             coinids.push({ coinId, base, newPair })

//             let original_buy_cost = orderSide === "SELL" ? 0 : parseFloat(data["cost"]);
//             let original_sell_cost = orderSide === "SELL" ? parseFloat(data["cost"]) : 0;

//             let usd_buy_cost = 0;
//             let usd_sell_cost = 0
//             let price_in_usd = 0

//             const isUsdPair = base == "usd" ? true : false
//             if (base == !"usd") {
//                 let { usdPrice, usdPair, error, message } = await convertPriceInUSD(newPair, time)
//                 if (error) {
//                     usdPrice = 0;
//                     usdPair = 0;
//                     console.log("convertPriceInUSD error: " + message);
//                     usd_buy_cost = 0;
//                     usd_sell_cost = 0;
//                 }
//                 price_in_usd = usdPrice
//                 usd_buy_cost = orderSide === "SELL" ? 0 : parseFloat(coinUnits * usdPrice);
//                 usd_sell_cost = orderSide === "SELL" ? parseFloat(coinUnits * usdPrice) : 0;
//             }

//             if (base == "usd") {
//                 usd_buy_cost = original_buy_cost
//                 usd_sell_cost = usd_sell_cost;
//                 price_in_usd = original_price
//             }

//             let coinUnits = orderSide == "SELL" ? -parseFloat(data["executed"]) : parseFloat(data["executed"])
//             coinUnits = parseFloat(coinUnits)
//             const finalData= {
//                 time: data["time"],
//                 usd_pair: isUsdPair ? newPair : "NA",
//                 coin_id: coinId ? coinId : newPair,
//                 original_pair: newPair,
//                 original_price: original_price,
//                 base: base ? base : originalPair,
//                 price_in_usd: usd,
//                 order_type: data["side"],
//                 coin_units: coinUnits,
//                 original_buy_cost,
//                 usd_buy_cost,
//                 original_sell_cost,
//                 usd_sell_cost,
//                 is_usd_pair: isUsdPair,
//                 user_id: userId,
//                 portfolio,
//                 comment: "",
//                 tag,
//             };


//         console.table(coinids)
//         console.log("coininds length =>>>", coinids.length)
//         return modifiedTransactionData; // Remove undefined values
//     } catch (error) {
//         console.error(error);
//         throw error; // Rethrow the error for better error handling upstream
//     }

// }

const convertPriceInUSD = require("./convertPriceInUSD.utils");
const parseCryptoPair = require("./parseCryptopair");

async function CUSTOM(transactionData, tag = "NA", userId, portfolio) {
    const coinids = [];
    const allCoinData = [];

    try {
        // Loop through each transaction data
        for (const data of transactionData) {
            const original_price = parseFloat(data["price"]);
            const { base, newPair, coinId } = parseCryptoPair(data["pair"]);
            const originalPair = data["pair"];
            let orderSide = data["side"];
            orderSide = orderSide.toUpperCase();
            coinids.push({ coinId, base, newPair });

            let original_buy_cost = orderSide === "SELL" ? 0 : parseFloat(data["cost"]);
            let original_sell_cost = orderSide === "SELL" ? parseFloat(data["cost"]) : 0;

            let usd_buy_cost = 0;
            let usd_sell_cost = 0;
            let price_in_usd = 0;

            const isUsdPair = base === "usd";

            // Check if the base currency is not USD and convert to USD
            if (!isUsdPair) {
                // Introduce a 3-second delay before calling convertPriceInUSD
                await delay(1500);

                // Call convertPriceInUSD to get USD price for the newPair at the specified time
                const { usdPrice, usdPair, error, message } = await convertPriceInUSD(newPair, data["time"]);

                if (error) {
                    // Handle the error from convertPriceInUSD
                    usd_buy_cost = 0;
                    usd_sell_cost = 0;
                    console.log("convertPriceInUSD error: " + message);
                } else {
                    price_in_usd = usdPrice;
                    usd_buy_cost = orderSide === "SELL" ? 0 : parseFloat(data["executed"]) * usdPrice;
                    usd_sell_cost = orderSide === "SELL" ? parseFloat(data["executed"]) * usdPrice : 0;
                }
            }

            // If the base currency is USD, use the original values
            if (isUsdPair) {
                usd_buy_cost = original_buy_cost;
                usd_sell_cost = original_sell_cost;
                price_in_usd = original_price;
            }

            // Calculate coinUnits based on the order side
            let coinUnits = orderSide === "SELL" ? -parseFloat(data["executed"]) : parseFloat(data["executed"]);
            coinUnits = parseFloat(coinUnits);

            // Create the final data object for the transaction
            const finalData = {
                time: data["time"],
                usd_pair: isUsdPair ? newPair : "NA",
                coin_id: coinId ? coinId : newPair,
                original_pair: newPair,
                original_price: original_price,
                base: base ? base : originalPair,
                price_in_usd,
                order_type: data["side"],
                coin_units: coinUnits,
                original_buy_cost,
                usd_buy_cost,
                original_sell_cost,
                usd_sell_cost,
                is_usd_pair: isUsdPair,
                user_id: userId,
                portfolio,
                comment: "",
                tag,
            };

            allCoinData.push(finalData);

            // Log the coinids and length for debugging
            console.table(coinids);
            console.log("coininds length =>>>", coinids.length);
        }

        return allCoinData;
    } catch (error) {
        console.error(error);
        throw error; // Rethrow the error for better error handling upstream
    }
}
const data = [
    {
        "time": "12/30/2021 11:02",
        "pair": "DYDXINR",
        "price": 8.68,
        "executed": 0.34,
        "cost": 2.9512,
        "side": "Buy",
        "fee": 0
    },
    {
        "time": "12/28/2021 13:20",
        "pair": "USDTINR",
        "price": 79.62,
        "executed": 314.02,
        "cost": 25002.2724,
        "side": "Buy",
        "fee": 0
    },
    {
        "time": "12/8/2021 17:00",
        "pair": "USDTINR",
        "price": 80.56,
        "executed": 94.89,
        "cost": 7644.3384,
        "side": "Buy",
        "fee": 0
    },
    {
        "time": "12/7/2021 7:05",
        "pair": "WRXINR",
        "price": 98.54,
        "executed": 6.1,
        "cost": 601.094,
        "side": "Buy",
        "fee": 0
    },
    {
        "time": "12/7/2021 7:05",
        "pair": "WRXINR",
        "price": 98.54,
        "executed": 28.8,
        "cost": 2837.952,
        "side": "Buy",
        "fee": 0
    },
    {
        "time": "12/7/2021 7:05",
        "pair": "WRXINR",
        "price": 98.54,
        "executed": 5.8,
        "cost": 571.532,
        "side": "Buy",
        "fee": 0
    }
]
// Function to introduce a delay in milliseconds
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const result = Promise.resolve(CUSTOM(data, "new", 5454, "sds"))
console.table(result);
