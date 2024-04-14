// https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Cpolkadot&vs_currencies=inr%2Cusd%2Cusdt

function createCoinIdString(idArray) {
    let coinIdString = ""
    idArray.map((coinId) => {
        coinIdString += coinId + '%2C'
    })
    return coinIdString
    // return `https://api.coingecko.com/api/v3/simple/price?ids=${coinIdString}&vs_currencies=inr%2Cusd%2Cusdt`;

}


export default createCoinIdString ;