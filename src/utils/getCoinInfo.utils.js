const { default: axios } = require("axios")

const getCoinInfo = async (coinid) => {
    try {
        const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinid}&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en`
        console.log("url=>" + url)
        let result = await axios.get(url)
        result = await result.data
        return result;

    } catch (error) {
        console.error(error)
    }
}
// async function p(coinId)
// {let s= await getCoinInfo(coinId)
//     console.log(s)
// }
// p("bitcoin")
export default getCoinInfo 