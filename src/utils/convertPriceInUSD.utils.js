// const axios = require("axios");

import axios from "axios";
import parseCryptoPair from "./parseCryptopair.utils.js";
import getUnixTime from "./getUnixTime.js";
// import getUnixTime from "../getUnixTime.js";

// const getUnixTime = require("../getUnixTime");
// const parseCryptoPair = require("./parseCryptopair.utils");

const convertPriceInUSD = async (trendingPair, time) => {
    console.log("ft=> ", time);
    const { fromTimeStamp, toTimeStamp, isOlderTime } = getUnixTime(time);
    const { coinId, newPair, symbol } = parseCryptoPair(trendingPair);

    const currentPrice = isOlderTime
        ? await getPriceHistoryWithDelay(coinId, fromTimeStamp, toTimeStamp)
        : await getCurrentPriceInUSDWithDelay(coinId);

    return {
        usdPrice: currentPrice,
        originalPair: newPair,
        usdPair: `${symbol}/usd`,
        isOlderTime,
    };
};

const getPriceHistoryWithDelay = async (coinId, fromTimeStamp, toTimeStamp) => {
    try {
        // await delay(2500);
        const link = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart/range?vs_currency=usd&from=${fromTimeStamp}&to=${toTimeStamp}&precision=9`;
        console.log("link =>" + link)
        const response = await axios(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart/range?vs_currency=usd&from=${fromTimeStamp}&to=${toTimeStamp}&precision=9`);
        const coinUsdPriceResult = response.data;
        console.log("PRICE HISTORY :=>", coinUsdPriceResult["prices"][0][1]);

        // Add a one-second delay before returning the result
        // await delay(2500);

        return coinUsdPriceResult["prices"][0][1];
    } catch (error) {
        console.error("Error fetching price history:", error);
        return {
            error: true,
            message: error.message,
        };
    }
};

const getCurrentPriceInUSDWithDelay = async (coinId) => {
    try {
        // await delay(2500);
        const response = await axios(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`);
        const currentPriceResult = response.data;
        // console.log("current price :=>", currentPriceResult[coinId]['usd']);

        // Add a one-second delay before returning the result
        // await delay(2500);

        return currentPriceResult[coinId]['usd'];
    } catch (error) {
        console.error("Error fetching current price:", error);
        return {
            error: true,
            message: error.message,
        };
    }
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// const exampleResult = convertPriceInUSD("DYDXUSDT", "12/30/2023 11:02");
// exampleResult.then((data) => {
//     console.log(data);
// });

export default convertPriceInUSD;
