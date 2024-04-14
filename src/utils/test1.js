//  // Read CSV content from Cloudinary

//         // console.log("cloudinaryResponse", cloudinaryUrl);
//         // Convert CSV content to JSON

//         // Return or further process the JSON data
//         // return jsonResult;
//         // ===================
//         // Read CSV content from Cloudinary
//         readCSVFile(csvContent, req, res)
//                 async function readCSVFile(csvContent, res, req) {
//         //             // transaction format
//         //             /*.secure_url

//         //         {   UID,Account Type,Order ID,Order Time(UTC+05:30),Symbol,Side,Order Type,Order Price,Order Amount,Avg. Filled Price,Filled Amount,Filled Volume,Filled Volume (USDT),Filled Time(UTC+05:30),Fee,Fee Currency,Status
//         //   --------------------------- FOR KUCOIN ------------------------------------------------
//         //            orderTime :time of order execution
//         //            Symbol : coin pair like BTC-USDT
//         //            Side : order type like buy / sell
//         //            Avg. Filled Price : order execution price of coin
//         //            Filled Amount : No. of coin buyed or selled
//         //            Filled Volume (USDT) : amount of base currency converted into usdt
//         //            Filled Volume : amount of base currency
//         //            Fee :Transaction fees
//         //            Fee Currency :fees paid in which currency
//         //   ---------------------------------------------------------------------------------------

//         //   "Date(UTC)","Pair","Side","Price","Executed","Amount","Fee"
//         //   ----------------------------------For Binance -----------------------------------------------------
//         //           Date(UTC) :transactio execution time
//         //           Pair: BTCUSDT
//         //           Side :Buy /sell
//         //           Price : price of coin at time of order execution
//         //           Executed : No. of coins buyed or selled format (90.2000000000VET)
//         //           Amount : amount of base currency  format (90.2000000000USDT)
//         //           fee :amout of fees

//         //   ---------------------------------------------------------------------------------
//         //         }*/

//         //             var AssetSymbol = []
//         //             let RemoveUSDT, assetprice, filledunits, buycost, time;
//         //             var sellcost = 0, orderside;
//         //             let CSVfinalArray

//                     csvtojson({ flatKeys: true }).
//                         fromString(csvContent)
//                         // .then((data)=>JSON.parse(data))
//                         .then((JsonDATA) => {
//                             console.log("jsondata=>", JsonDATA)
//                             for (var object of JsonDATA) {

//                                 Symbol = (object?.Symbol) ? object?.Symbol : object["Spot Pairs"] ? object["Spot Pairs"] : object.Pair;
//                                 Symbol = Symbol.toUpperCase()
//                                 time = (object["Time(UTC+05:30)"]) ? object["Time(UTC+05:30)"] : object["Filled Time (Local Time)"] ? object["Filled Time (Local Time)"] : object["Date(UTC)"]
//                                 // coin pair / symbol
//                                 // console.log("symbol :", Symbol)
//                                 assetprice = (object?.Price) ? object.Price : object["Filled Price"] ? object["Filled Price"] : object['Avg. Filled Price'] // price of coin at the time of buying
//                                 assetprice = parseFloat(assetprice);
//                                 // console.log("buyPrice :", assetprice)

//                                 filledunits = (object?.Executed) || object?.Executed || object?.["Filled Quantity"] || object?.["Filled Quantity"] || object?.['Filled Amount'] // quantity of coin you Buy or Sell
//                                 filledunits = parseFloat(filledunits);
//                                 // console.log("units  :", filledunits)
//                                 // quantity of coin you Buy or Sell

//                                 orderside = object?.Side || object?.Side || object?.["Direction"] || object?.["Direction"] || object?.Side // type of order BUY/SELL
//                                 orderside = orderside.toUpperCase() // type of order BUY/SELL
//                                 // console.log("side :", orderside)
//                                 buycost = object?.Amount || object.Amount || object?.["Filled Value"] || object?.["Filled Value"] || object?.['Filled Volume']  // amout of base currency / amount of USDT/BTC/BUSD/USDC paid for coin

//                                 buycost = parseFloat(buycost) // amout of base currency / amount of USDT/BTC/BUSD/USDC paid for coin
//                                 // if (Symbol != "POLX-USDT" && Symbol != "ARNM-USDT" && Symbol != "WOOP-USDT" && Symbol != "USDT-USDC" && Symbol != "USDC-USDT" && Symbol != "OXT-USDT" && Symbol != "ARMN-USDT" && Symbol != "MLS-USDT" && Symbol != "AFK-USDT" && Symbol != "KCS-USDT" && Symbol != "VR-USDT" && Symbol != "ONSTON-USDT" && Symbol != "GMM-USDT" && Symbol != "XCN-USDT" && Symbol != "WAXP-USDT" && Symbol != "RSR-USDT" && Symbol != "MLS-USDT" && Symbol != "GALAX-USDT" && Symbol != "BLOK-USDT" && Symbol != "EWT-USDT" && Symbol != "CTSI-USDT" && Symbol != "CWEB-USDT" && Symbol != "KDA-USDT" && Symbol != "UTK-USDT" && Symbol != "WAX-USDT" && Symbol != "MOVR-USDT" && Symbol != "VIDT-USDT") {
//                                 const newSymbol = parseCryptoPair(Symbol).newPair

//                                 // console.log("newSymbol :::=>>", newSymbol, "oldSymbol :::=> ", Symbol)
//                                 AssetSymbol.push(newSymbol)
//                                 // console.log(AssetSymbol)
//                                 if (orderside == "SELL" || orderside == "Sell" || orderside == "sell") {
//                                     sellcost = parseFloat(buycost) //
//                                     buycost = parseInt(0) //buy cost will be 0
//                                     filledunits = 0 - parseFloat(filledunits) //
//                                 }
//                                 else {

//                                     sellcost = parseFloat(0)
//                                     buycost = parseFloat(buycost)
//                                     filledunits = parseFloat(filledunits)
//                                 }
//                                 var CSVlocalArray = [];
//                                 CSVlocalArray.push(time, `${newSymbol}`, `${orderside}`, assetprice, filledunits, buycost, sellcost)
//                                 // console.table(CSVlocalArray)
//                                 CSVfinalArray.push(CSVlocalArray)
//                                 // console.table(CSVfinalArray)
//                                 // console.table(CSVlocalArray)
//                                 // console.table(CSVfinalArray)

//                             }
//                             console.table(CSVfinalArray)

//                             setTimeout(() => {
//                                 var Sqcsv = `INSERT INTO ${user}_portfolio  (TIME,Coin_Name,ORDER_TYPE,PRICE,UNITS,TOTAL_COST,SELL_COST ) VALUES ?`
//                                 cnn.query(Sqcsv, [CSVfinalArray], (err, result) => {
//                                     if (err) console.log(err)
//                                     console.log("SQL RESPONSE FROM CSV FUNCTION :", result)
//                                 })
//                                 CSVResponse(CSVfinalArray.length);
//                             }, 3000)
//                             console.log(JsonDATA)

//                         })
//                     const jsonArray = await csvtojson().fromString(csvContent);

//                     // Log or do something with the resulting JSON data
//                     console.log(jsonArray);

//                 }





// Your existing delay function
// const convertPriceInUSD = require("./convertPriceInUSD.utils.js");
// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// A simple asynchronous queue to handle API requests with a specified delay

const convertPriceInUSD = require("./convertPriceInUSD.utils.js");
const parseCryptoPair = require("./parseCryptopair.js");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class AsyncQueue {
    constructor(delay) {
        this.delay = delay;
        this.queue = [];
        this.isProcessing = false;
    }

    async enqueue(fn) {
        const promise = new Promise(async (resolve) => {
            this.queue.push({ fn, resolve });
            await this.processQueue();
        });

        return promise;
    }

    async processQueue() {
        if (!this.isProcessing && this.queue.length > 0) {
            this.isProcessing = true;
            const { fn, resolve } = this.queue.shift();
            await fn();
            await delay(this.delay);
            this.isProcessing = false;
            resolve();
            await this.processQueue();
        }
    }
}


const apiRequestQueue = new AsyncQueue(1500);

async function convertPriceInUSDWithThrottle(pair, time) {
    return apiRequestQueue.enqueue(async () => {
        return await convertPriceInUSD(pair, time);
    });
}

// Function to parse crypto pair
// function parseCryptoPair(pair) {
//     // Implement the parsing logic here
//     // Return an object with 'base' and 'newPair' properties
// }
const nonUsdData = []
async function processTransactionData(data, tag) {

    // const { usdPrice, usdPair, error } = base !== "usd" ? await convertPriceInUSDWithThrottle(data["pair"], data["time"]) : { usdPrice: data["price"], usdPair: newPair };

    // if (error) {
    //     console.error("convertInUsd => error", error);
    //     return;
    // }


    // const usd_pair = base !== "usd" ? await usdPair : newPair;
    // const usd_price = base !== "usd" ? await usdPrice : data["price"];

    // const usd_pair = base !== "usd" ? await usdPair : newPair;
    //             const usd_price = base !== "usd" ? await usdPrice : data["price"];
    //             console.log("usd pair: " + usd_pair)
    //            

}

async function CUSTOM(transactionData, tag = "NA") {
    const noneUsdData = [];// array this will store all transaction data of none usd pairs
    try {

        // process transaction data with usd pairs
        const transactionDataOfUsdPairs = await Promise.all(transactionData.map(async (data) => {
            const original_price = data["price"];
            const { base, newPair } = await parseCryptoPair(data["pair"]);
            if (base == "usd") {
                const original_buy_cost = data["side"] === "SELL" ? 0 : parseFloat(data["cost"]);
                const original_sell_cost = data["side"] === "SELL" ? parseFloat(data["cost"]) : 0;
                const usd_buy_cost = data["side"] === "SELL" ? 0 : parseFloat(data["cost"])
                const usd_sell_cost = data["side"] === "SELL" ? parseFloat(data["cost"]) : 0;

                return {
                    time: data["time"],
                    usd_pair: newPair,
                    original_pair: newPair,
                    orinal_price: original_price,
                    base,
                    price_in_usd: original_price,
                    order_type: data["side"],
                    coin_units: parseFloat(data["executed"]),
                    original_buy_cost,
                    usd_buy_cost,
                    original_sell_cost,
                    usd_sell_cost,
                    comment: "",
                    tag,
                };
            }
            nonUsdData.push(data);
            // return modifiedTransactionData.filter(Boolean);
        }));
        console.log("usdTransaction ->", transactionDataOfUsdPairs)

        // process transaction data of none usd pairs 
        const transactionDataOfNoneUsdPairAfterConverson = await Promise.all(nonUsdData.map(async (data, index) => {

            const original_price = data["price"];
            const time = data["time"];
            const { base, newPair } = parseCryptoPair(data["pair"]);

            const ss = await convertPriceInUSDWithThrottle(newPair, time);
            console.log(ss)
            // if (error) {
            //     console.error(error)
            // }
            // const original_buy_cost = data["side"] === "SELL" ? 0 : parseFloat(data["cost"]);
            // const original_sell_cost = data["side"] === "SELL" ? parseFloat(data["cost"]) : 0;
            // const usd_buy_cost = data["side"] === "SELL" ? 0 : await usdPrice * parseFloat(data["executed"])
            // const usd_sell_cost = data["side"] === "SELL" ? await usdPrice * parseFloat(data["executed"]) : 0;

            // return {
            //     time: data["time"],
            //     usd_pair: usdPair,
            //     original_pair: newPair,
            //     orinal_price: original_price,
            //     base,
            //     price_in_usd: usdPrice,
            //     order_type: data["side"],
            //     coin_units: parseFloat(data["executed"]),
            //     original_buy_cost,
            //     usd_buy_cost,
            //     original_sell_cost,
            //     usd_sell_cost,
            //     comment: "",
            //     tag,
            // };

        }))
        console.log("usdTransaction ->", transactionDataOfUsdPairs)
        return [transactionDataOfUsdPairs, ...transactionDataOfNoneUsdPairAfterConverson]

    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function p(tdata) {
    const p = await CUSTOM(tdata)
    console.log(p);
    return p;
}

const data = [
    {
        "time": "12/30/2021 11:02",
        "pair": "DYDXUSDT",
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
    },
    {
        "time": "12/7/2021 7:05",
        "pair": "WRXINR",
        "price": 98.54,
        "executed": 10,
        "cost": 985.4,
        "side": "Buy",
        "fee": 0
    },
    {
        "time": "12/6/2021 17:02",
        "pair": "WRXINR",
        "price": 91.88,
        "executed": 45.6,
        "cost": 4189.728,
        "side": "Buy",
        "fee": 0
    },
    {
        "time": "12/6/2021 0:04",
        "pair": "WRXUSDT",
        "price": 1.17587,
        "executed": 27.2,
        "cost": 31.983664,
        "side": "Buy",
        "fee": 0
    },
    {
        "time": "12/6/2021 0:04",
        "pair": "WRXUSDT",
        "price": 1.17587,
        "executed": 4.8,
        "cost": 5.644176,
        "side": "Buy",
        "fee": 0
    },
    {
        "time": "12/6/2021 0:04",
        "pair": "WRXUSDT",
        "price": 1.17587,
        "executed": 11.5,
        "cost": 13.522505,
        "side": "Buy",
        "fee": 0
    },
    {
        "time": "12/6/2021 0:02",
        "pair": "USDTINR",
        "price": 82.3,
        "executed": 51,
        "cost": 4197.3,
        "side": "Buy",
        "fee": 0
    },
    {
        "time": "12/5/2021 21:52",
        "pair": "WRXUSDT",
        "price": 1.14491,
        "executed": 10.1,
        "cost": 11.563591,
        "side": "Buy",
        "fee": 0
    },
    {
        "time": "12/5/2021 21:52",
        "pair": "WRXUSDT",
        "price": 1.14491,
        "executed": 2.8,
        "cost": 3.205748,
        "side": "Buy",
        "fee": 0
    },
    {
        "time": "12/5/2021 21:39",
        "pair": "WRXUSDT",
        "price": 1.14491,
        "executed": 2.9,
        "cost": 3.320239,
        "side": "Buy",
        "fee": 0
    },
    {
        "time": "12/5/2021 21:39",
        "pair": "WRXUSDT",
        "price": 1.14491,
        "executed": 2.9,
        "cost": 3.320239,
        "side": "Buy",
        "fee": 0
    },
    {
        "time": "12/5/2021 21:39",
        "pair": "WRXUSDT",
        "price": 1.14491,
        "executed": 2.9,
        "cost": 3.320239,
        "side": "Buy",
        "fee": 0
    },
    {
        "time": "12/5/2021 21:39",
        "pair": "WRXUSDT",
        "price": 1.14491,
        "executed": 2.9,
        "cost": 3.320239,
        "side": "Buy",
        "fee": 0
    },
    {
        "time": "12/5/2021 21:35",
        "pair": "WRXUSDT",
        "price": 1.14491,
        "executed": 3.5,
        "cost": 4.007185,
        "side": "Buy",
        "fee": 0
    }
]
p(data)

// Usage
// (async () => {

//     const exampleResult = await convertPriceInUSDWithThrottle("BTC/USD", "2024-01-15T12:00:00");
//     console.log(exampleResult);
// })();



// Usage


// Remember to replace "[...transactionData]" with your actual array of transaction data.
