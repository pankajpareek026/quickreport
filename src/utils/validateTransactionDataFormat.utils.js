const transactionFormates = {
    "BINANCE": {
        "Date(UTC)": "ORDER DATE",
        Pair: "symbol",
        Price: "price of coin",
        Executed: "Amount of coin buy or sell",
        Amount: "Amout of base currency you paid Like currency you paid Like USDT / BTC /INR ",
        Side: "buy or sell",
        Fee: "fees paid"
    },

    "KUCOIN": {
        UID: '****4746',//userid
        'Account Type': 'mainAccount',
        'Order ID': '61fea5923526430001244ccd',
        'Order Time(UTC+05:30)': '2022-02-05 21:58:02',
        Symbol: 'TRX-USDT',//pair
        Side: 'SELL',//buy or sell
        'Order Type': 'LIMIT', //order type LIMIT/MARKET
        'Order Price': '0.065544',//ORDER PRICE
        'Order Amount': '1553.4348', // NO OF COINS YOU BUY OR SELL
        'Avg Filled Price': '0.065544',//AVERAGE PRICE OF BUYED OR SELLED COIN
        'Filled Amount': '1553.4348',// ACTUAL NO OF COINS YOU BUY OR SELL
        'Filled Volume': '101.8183305312',// AMOUNT OF BASE CURRENCY LIKE USDT .BTC
        'Filled Volume (USDT)': '101.8183305312',// VALUE OF BASE CURRENCY IN USDT
        'Filled Time(UTC+05:30)': '2022-02-05 21:58:03',// TIME WHEN TRANSACTION COMPLETED
        Fee: '0.1018183305312',
        'Fee Currency': 'USDT',
        Status: 'deal'
    },
    "BYBIT": {
        "Filled Time (Local Time)": "ORDER Date",
        "Spot Pairs": "symbol",
        'Order Type': 'LIMIT/MARKET',
        "Filled Price": "price of coin",
        "Filled Quantity": "Amount of coin buy or sell",
        "Filled Value": "Amout of base currency you paid Like currency you paid Like USDT / BTC /INR ",
        "Direction": "buy or sell",
        "Fees": "fees paid",
        'Transaction ID': '65739520',
        'Order No.': '65106688',
        'Timestamp (UTC)': '2023-12-26 16:21:22'
    },
    "CUSTOM": {
        "time": "ORDER Date",
        "pair": "symbol",
        "price": "price of coin",
        "executed": "Amount of coin buy or sell",
        "cost": "Amout of base currency you paid Like currency you paid Like USDT / BTC /INR ",
        "side": "buy or sell",
        "fee": "fees paid"
    },

}
const validateTransactionDataFormate = async (transactionObject, exchange) => {
    const userFormate = Object.keys(transactionObject)
    const originalFormate = Object.keys(transactionFormates[exchange])
    // console.log("user provided  formate =>", userFormate)

    // console.log("original supported formate =>", originalFormate)

    // const isValid = JSON.stringify(userFormate) === JSON.stringify(originalFormate)
    const isValid = originalFormate.length === userFormate.length && originalFormate.every(key => userFormate.includes(key))
    // console.log("isValid =>", isValid)
    if (!isValid) {
        return {
            error: true,
            message: "unsupported trnasaction file format",
            validFormate: transactionFormates[exchange],
            provideFormate: transactionObject
        }
    }
    return { isValid, exchange }

}
let binanceSampleFormate = {
    'Date(UTC)': '2021-12-01 09:43:49',
    Pair: 'VETUSDT',
    Side: 'SELL',
    Price: '0.1210900000',
    Executed: '90.2000000000VET',
    Amount: '10.92231800USDT',
    Fee: '0.0000128200BNB'
}
const bybitSampleFormat = {
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
}

const kucoinSampleFomate = {
    UID: '****4746',
    'Account Type': 'mainAccount',
    'Order ID': '61fea5923526430001244ccd',
    'Order Time(UTC+05:30)': '2022-02-05 21:58:02',
    Symbol: 'TRX-USDT',
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
}
const customSampleFomate = {
    time: '12/30/2021 11:02',
    pair: 'DYDXUSDT',
    price: '8.68',
    executed: '0.34',
    cost: '2.9512',
    side: 'Buy',
    fee: '0'
}
// validateTransactionDataFormate(data, "BINANCE");
export default validateTransactionDataFormate;