import parseCryptoPair from "./parseCryptopair.utils.js";

// import parseCryptoPair from "./parseCryptopair.utils";
parseCryptoPair
const transactionFormater = {

    // async binanceTransactionFormatter(transactionData, tag) {
    //     try {
    //         const modifiedTransactionData = transactionData.map(async (data, index) => {
    //             /**
    //              * "BINANCE": {
    //                 "Date(UTC)": "ORDER DATE",
    //                 Pair: "symbol",
    //                 Price: "price of coin",
    //                 Executed: "Amount of coin buy or sell",
    //                 Amount: "Amout of base currency you paid Like currency you paid Like USDT / BTC /INR ",
    //                 Side: "buy or sell",
    //                 Fee: "fees paid"
    //             },
    //              //TODO => store all transaction data in defret variables
    //              //TODO => find out base currency using parseCryptoPair()
    //              //TODO => if coinbase is other than USD then find out price in usd usin changePriceInUSD()
    //              //TODO => store all data which is returened by changePriceInUSD()
    //              //TODO => check transaction side Buy or sell
    //                        if sell =>then sellcost =cost 
    //                                  buycost=0
    //                                  usdBuycost =0
    //                                  usdSellcost =priceInUSd*priceInUSd

    //              */

    //             let time, pair, price, executed, cost, side, fee, usd_buy_cost, original_buy_cost, usd_pair, usd_price, usd_sell_cost, original_sell_cost;
    //             time = data["Date(UTC)"];
    //             pair = data["Pair"];
    //             price = parseFloat(data["Price"]);
    //             executed = parseFloat(data["Executed"]);
    //             cost = parseFloat(data["Amount"]);
    //             side = data["Side"];
    //             // side = side.toUppercase()
    //             console.log("side=>", side);
    //             fee = data["Fee"];
    //             const { base, newPair } = parseCryptoPair(pair)
    //             if (base !== "USD") {
    //                 /** usdPrice: await currentPrice,
    //         originalPair: newPair,
    //         usdPair: `${symbol}/usd`,
    //         isOlderTime */
    //                 const { usdPrice, usdPair, error } = await convertPriceInUSD(pair, time);
    //                 if (error) {
    //                     console.log("convertInUsd =<error>",error);
    //                     return
    //                 }

    //                 usd_pair =await usdPair;
    //                 usd_price =await usdPrice;
    //             }

    //             if (side == "SELL") {
    //                 original_sell_cost = cost;
    //                 original_buy_cost = 0;
    //                 usd_buy_cost = 0;
    //                 usd_sell_cost = usd_price * executed;

    //             }

    //             return {
    //                 time,
    //                 usd_pair,
    //                 original_pair: newPair,
    //                 orinal_price: price,
    //                 base,
    //                 price_in_usd: usd_price,
    //                 order_type: side,
    //                 coin_units: executed,
    //                 original_buy_cost: cost,
    //                 usd_buy_cost,
    //                 original_sell_cost,
    //                 usd_sell_cost,
    //                 comment: "",
    //                 tag: tag
    //             }

    //         })
    //         return await modifiedTransactionData;
    //     } catch (error) {
    //         console.error(error)
    //     }
    // }
    async BINANCE(transactionData, tag = "NA", userId, portfolio) {
        try {
            const modifiedTransactionData = Promise.all(transactionData.map(async (data) => {
                const original_price = parseFloat(data["Price"]);
                const { base, newPair, coinId, symbol } = parseCryptoPair(data["Pair"]);
                let orderSide = data["Side"];
                orderSide = orderSide.toUpperCase();
                const originalPair = data["Pair"];
                const isUsdPair = base == "usd" ? true : false

                let original_buy_cost = orderSide === "SELL" ? 0 : parseFloat(data["Amount"]);
                let original_sell_cost = orderSide === "SELL" ? parseFloat(data["Amount"]) : 0;
                let usd_buy_cost = 0;
                let usd_sell_cost = 0;
                let price_in_usd = 0

                if (base == "usd") {
                    usd_buy_cost = original_buy_cost
                    usd_sell_cost = original_sell_cost
                    price_in_usd = original_price
                }
                return {
                    time: data["Date(UTC)"],
                    usd_pair: isUsdPair ? newPair : "NA",
                    original_pair: newPair,
                    symbol: symbol ? symbol : originalPair,
                    original_price: original_price,
                    base: base ? base : originalPair,
                    coin_id: coinId ? coinId : originalPair,
                    price_in_usd,
                    order_type: data["Side"],
                    coin_units: orderSide == "SELL" ? -parseFloat(data["Executed"]) : parseFloat(data["Executed"]),
                    is_usd_pair: isUsdPair,
                    original_buy_cost,
                    usd_buy_cost,
                    user_id: userId,
                    portfolio,
                    original_sell_cost,
                    usd_sell_cost,
                    comment: "",
                    tag,
                };
            }));

            return modifiedTransactionData// Remove undefined values
        } catch (error) {
            console.error(error);
            throw error; // Rethrow the error for better error handling upstream
        }
    }



    ,
    async CUSTOM(transactionData, tag = "NA", userId, portfolio) {
        const coinids = [];
        try {
            const modifiedTransactionData = Promise.all(transactionData.map(async (data) => {
                const original_price = parseFloat(data["price"]);
                let { base, newPair, coinId, symbol } = parseCryptoPair(data["pair"]);
                const originalPair = data["pair"]
                let orderSide = data["side"]
                orderSide = orderSide.toUpperCase();
                coinids.push({ coinId, base, newPair })
                let original_buy_cost = orderSide === "SELL" ? 0 : parseFloat(data["cost"]);
                let original_sell_cost = orderSide === "SELL" ? parseFloat(data["cost"]) : 0;
                let usd_buy_cost = 0;
                let usd_sell_cost = 0
                let price_in_usd = 0
                let usdPair = ""
                let isUsdPair = base == "usd" ? true : false

                if (base == "usd") {
                    usdPair == newPair
                    usd_buy_cost = original_buy_cost
                    usd_sell_cost = original_sell_cost;
                    price_in_usd = original_price
                    // usdPrice = original_price
                }

                if (base == "inr") {
                    usd_buy_cost = orderSide == "SELL" ? 0 : parseFloat(original_buy_cost / 87)
                    usd_sell_cost = orderSide == "SELL" ? parseFloat(original_sell_cost / 87) : 0
                    usdPair = symbol + "/" + base;
                    isUsdPair = true;
                    price_in_usd = parseFloat(original_price / 87)
                }

                let coinUnits = orderSide == "SELL" ? -parseFloat(data["executed"]) : parseFloat(data["executed"])
                coinUnits = parseFloat(coinUnits)
                return {
                    time: data["time"],
                    usd_pair: isUsdPair ? usdPair : "NA",
                    coin_id: coinId ? coinId : newPair,
                    original_pair: newPair,
                    symbol: symbol ? symbol : "NA",
                    original_price: original_price,
                    base: isUsdPair ? "usd" : base ? base : originalPair,
                    price_in_usd: price_in_usd,
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
            }));
            console.table(coinids)
            console.log("coininds length =>>>", coinids.length)
            return modifiedTransactionData; // Remove undefined values
        } catch (error) {
            console.error(error);
            throw error; // Rethrow the error for better error handling upstream
        }

    }
    ,

    async KUCOIN(transactionData, tag = "NA", userId, portfolio) {
        try {
            const modifiedTransactionData = await Promise.all(transactionData.map(async (data) => {
                const original_price = parseFloat(data["Order Price"]);
                let orderSide = data["Side"];
                orderSide = orderSide.toUpperCase();
                const { base, newPair, coinId, symbol } = parseCryptoPair(data["Symbol"]);
                const originalPair = data["Symbol"];
                let isUsdPair = base == "usd" ? true : false
                // const { usdPrice, usdPair, error } = base !== "usd" ? await convertPriceInUSD(data["Symbol"], data["Filled Time(UTC+05:30)"]) : { usdPrice: data["Order Price"], usdPair: data["Symbol"] };



                let original_buy_cost = orderSide === "SELL" ? 0 : parseFloat(data["Filled Volume"]);
                let original_sell_cost = orderSide === "SELL" ? parseFloat(data["Filled Volume"]) : 0;
                let usd_buy_cost = 0
                let usd_sell_cost = 0;
                let price_in_usd = 0
                // console.log("usd_sell_cost =>", parseFloat(data["Filled Amount"]))
                if (isUsdPair) {
                    usd_buy_cost = original_buy_cost
                    usd_sell_cost = original_sell_cost
                    price_in_usd = original_price
                }
                else if (symbol) {
                    price_in_usd = parseFloat(data["Filled Volume (USDT)"] / data["Filled Amount"])
                    usd_buy_cost = orderSide == "SELL" ? 0 : parseFloat(data["Filled Volume (USDT)"])
                    usd_sell_cost = orderSide == "SELL" ? parseFloat(data["Filled Volume (USDT)"]) : 0
                    isUsdPair = price_in_usd ? true : false
                }
                let coinUnits = orderSide == "SELL" ? -parseFloat(data["Filled Amount"]) : parseFloat(data["Filled Amount"])
                coinUnits = parseFloat(coinUnits)
                return {
                    time: data["Filled Time(UTC+05:30)"],
                    usd_pair: symbol ? symbol + "/usd" : "NA",
                    original_pair: newPair ? newPair : originalPair,
                    original_price: original_price,
                    base,
                    coin_id: coinId ? coinId : originalPair,
                    symbol,
                    price_in_usd,
                    order_type: orderSide,
                    coin_units: coinUnits,
                    original_buy_cost,
                    usd_buy_cost,
                    original_sell_cost,
                    usd_sell_cost,
                    user_id: userId,
                    portfolio,
                    is_usd_pair: isUsdPair,
                    comment: "",
                    tag,
                };
            }));

            return modifiedTransactionData.filter(Boolean); // Remove undefined values
        } catch (error) {
            console.error(error);
            throw error; // Rethrow the error for better error handling upstream
        }

    },

    async BYBIT(transactionData, tag = "NA", userId, portfolio) {
        try {
            const modifiedTransactionData = await Promise.all(transactionData.map(async (data) => {
                const original_price = parseFloat(data["Filled Price"]);
                let orderSide = data["Direction"];
                orderSide = orderSide.toUpperCase();
                const originalPair = data["Spot Pairs"];
                const { base, newPair, coinId, symbol } = parseCryptoPair(data["Spot Pairs"]);
                const isUsdPair = base == "usd" ? true : false
                // const { usdPrice, usdPair, error } = base.toUpperCase() !== "USD" ? await convertPriceInUSD(data["Spot Pairs"], data["Filled Time(UTC+05:Filled Time (Local Time))"]) : { usdPrice: data["Filled Price"], usdPair: data["Spot Pairs"] };




                let original_buy_cost = orderSide === "SELL" ? 0 : parseFloat(data["Filled Value"]);
                let original_sell_cost = orderSide === "SELL" ? parseFloat(data["Filled Value"]) : 0;
                let usd_buy_cost = 0;
                let usd_sell_cost = 0;
                let price_in_usd = 0
                if (isUsdPair) {
                    usd_buy_cost = original_buy_cost
                    usd_sell_cost = original_sell_cost
                    price_in_usd = original_price
                }
                let coinUnits = orderSide == "SELL" ? -parseFloat(data["Filled Quantity"]) : parseFloat(data["Filled Quantity"])
                coinUnits = parseFloat(coinUnits)
                return {
                    time: data["Filled Time (Local Time)"],
                    usd_pair: isUsdPair ? newPair : "NA",
                    original_pair: newPair ? newPair : originalPair,
                    orinal_price: original_price,
                    base: base ? base : originalPair,
                    coin_id: coinId ? coinId : originalPair,
                    symbol,
                    price_in_usd,
                    order_type: orderSide,
                    coin_units: coinUnits,
                    original_buy_cost,
                    usd_buy_cost,
                    original_sell_cost,
                    usd_sell_cost,
                    isUsdPair,
                    user_id: userId,
                    portfolio,
                    comment: "",
                    tag,
                };
            }));

            return modifiedTransactionData.filter(Boolean); // Remove undefined values
        } catch (error) {
            console.error(error);
            throw error; // Rethrow the error for better error handling upstream
        }

    }
}
let binanceSampleFormate = [{
    'Date(UTC)': '2021-12-01 09:43:49',
    Pair: 'VETBTC',
    Side: 'SELL',
    Price: '0.1210900000',
    Executed: '90.2000000000VET',
    Amount: '10.92231800USDT',
    Fee: '0.0000128200BNB'
}]

//     //  console.log(a)
//    const a= Promise.all(transactionFormater.binanceTransactionFormatter(binanceSampleFormate))
//    console.log(a)
const bybitSampleFormat = [{
    'Filled Time (Local Time)': '2023-12-26 21:51:22',
    'Spot Pairs': 'BEL/USDT',
    'Order Type': 'LIMIT',
    'Direction': 'BUY',
    'Filled Value': '4.977632000000000000 USDT',
    'Filled Price': '0.787600000000000000 USDT',
    'Filled Quantity': '6.320000000000000000 BEL',
    Fees: '0.006320000000000000 BEL',
    'Transaction ID': '65739520',
    'Order No.': '65106688',
    'Timestamp (UTC)': '2023-12-26 16:21:22'
}]
const kucoinSampleFomate = [{
    UID: '****4746',
    'Account Type': 'mainAccount',
    'Order ID': '61fea5923526430001244ccd',
    'Order Time(UTC+05:30)': '2022-02-05 21:58:02',
    Symbol: 'TRX-BTC',
    Side: 'SELL',
    'Order Type': 'LIMIT',
    'Order Price': '0.065544',
    'Order Amount': '1553.4348',
    'Avg Filled Price': '0.065544',
    'Filled Amount': '1553.4348',
    'Filled Volume': '101.8183305312',
    'Filled Volume (USDT)': '101.8183305312',
    'Filled Time(UTC+05:30)': '2022-02-05 21:58:03',
    Fee: '0.1018183305312',
    'Fee Currency': 'USDT',
    Status: 'deal'
}]
const customSampleFomate = [{
    time: '12/30/2021 11:02',
    pair: 'DYDXUSDT',
    price: '8.68',
    executed: '0.34',
    cost: '2.9512',
    side: 'sell',
    fee: '0'
}]
/*const ap = async (sample, userId) => {

    // const a = await transactionFormater.BINANCE(sample, "B105", 554526);
    // const a = await transactionFormater.BYBIT(sample, "Bybit026", userId);
    //     // const a = await transactionFormater.kucoinTransactionFormatter(sample, userId);
     const a = await transactionFormater.CUSTOM(sample, "WRX105", userId);

     console.log("aaaaa", a);

 }
 ap(customSampleFomate, 335533); */
export default transactionFormater;