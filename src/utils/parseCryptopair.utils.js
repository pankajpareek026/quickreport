import geckoCoinList from "./coinList.js"


function getCoinId(symbol) {
    return geckoCoinList.map((coinData) => {
        if (coinData.symbol == symbol) {
            // console.log(coinData)
            const coinId = coinData.id
            return coinId

            // console.log(symb)
            // console.table(coinData)
        }
        return null
    }).filter((info) => info !== null).join()
}
// console.log(getCoinId("btc"))
const pairMappings = {
    four: ["USDT", "BUSD", "TUSD", "USDC", "USDD", "USDP"],
    three: ["BTC", "ETH", "DAI", "USD", "BNB", "INR"]
}

function parseCryptoPair(pair) {
    // console.log("pair in function ", pair)
    // Clean the input pair by removing common separators and converting to uppercase
    let cleanedPair = pair.replace('/', "").replace('_', "").replace("-", "").replace('"', "").replace(/'/g, '')
    cleanedPair = cleanedPair.toUpperCase()
    // console.log("cleaned pair :", cleanedPair)
    // Check for minimum length requirement
    if (cleanedPair.length < 4) {
        return { symbol: null, base: null, newPair: pair, error: "invalid coin pair" };
    }

    // Log cleaned pair for debugging
    // console.log("Cleaned Pair:", cleanedPair);

    // Extract the last 3 and 4 characters to identify base currencies
    const threeCharBase = cleanedPair.slice(-3);
    const fourCharBase = cleanedPair.slice(-4);

    // Log the extracted bases for debugging
    // console.log("3-Char Base:", threeCharBase);
    // console.log("4-Char Base:", fourCharBase);

    // Process three-char base pairs


    // Process four-char base pairs
    const stableCoinPair = pairMappings.four.map((match) => {
        if (match === fourCharBase) {
            let symbol = cleanedPair.replace(match, "").toLowerCase();
            const newPair = `${symbol}/usd`.toLowerCase();
            const base = "usd";
            const coinId = getCoinId(symbol)

            return { symbol, base, newPair, coinId };
        }
        return null;
    }).filter(match => match !== null);
    const cryptoPair = pairMappings.three.map((match) => {
        if (match === threeCharBase) {
            let symbol = cleanedPair.replace(match, "").toLowerCase();
            const newPair = `${symbol}/${match}`.toLowerCase();
            const base = match.toLowerCase();
            const coinId = getCoinId(symbol)

            return { symbol, base, newPair, coinId };
        }
        return null;
    }).filter(match => match !== null);

    // Determine the result based on available pairs
    const result = cryptoPair.length > 0 ? cryptoPair[0]
        : stableCoinPair.length > 0 ? stableCoinPair[0]
            : { symbol: null, base: null, newPair: pair };

    return result;
}

// Example usage
// console.log(parseCryptoPair("linkbtc"));
export default parseCryptoPair;

