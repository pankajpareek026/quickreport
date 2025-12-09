/**
 * Coin List Management
 * Optimized dynamic coin list for datalists
 */

// Popular coins - CoinGecko IDs (for home page search)
const POPULAR_COINS = [
    'bitcoin', 'ethereum', 'binancecoin', 'solana', 'ripple', 'cardano',
    'dogecoin', 'polkadot', 'matic-network', 'avalanche-2', 'chainlink', 'uniswap',
    'litecoin', 'cosmos', 'ethereum-classic', 'stellar', 'algorand', 'vechain',
    'filecoin', 'tron', 'eos', 'aave', 'axie-infinity', 'the-sandbox',
    'decentraland', 'theta-token', 'fantom', 'near', 'aptos', 'arbitrum',
    'optimism', 'injective-protocol', 'sui', 'sei-network', 'celestia', 'render-token',
    'internet-computer', 'hedera-hashgraph', 'quant-network', 'elrond-erd-2', 'flow', 'immutable-x',
    'the-graph', 'sushi', 'curve-dao-token', 'compound-governance-token', 'maker', 'synthetix-network-token',
    'yearn-finance', '1inch', 'enjincoin', 'chiliz', 'basic-attention-token', '0x',
    'zcash', 'dash', 'monero', 'waves', 'omisego', 'kyber-network-crystal'
];

/**
 * Initialize coin datalist
 * @param {string} datalistId - ID of the datalist element
 */
function initCoinDatalist(datalistId = 'coinList') {
    const datalist = document.getElementById(datalistId);
    if (!datalist) return;
    
    // Clear existing options
    datalist.innerHTML = '';
    
    // Add popular coins
    POPULAR_COINS.forEach(coin => {
        const option = document.createElement('option');
        option.value = coin;
        datalist.appendChild(option);
    });
    
    // Fetch comprehensive coin list from CoinGecko
    fetchCoinGeckoCoinList(datalist);
}

/**
 * Fetch comprehensive coin list from CoinGecko
 * @param {HTMLElement} datalist - Datalist element to populate
 */
async function fetchCoinGeckoCoinList(datalist) {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/list');
        const coins = await response.json();
        
        if (coins && Array.isArray(coins)) {
            // Add all coins to datalist
            coins.forEach(coin => {
                if (coin.id && coin.symbol) {
                    const option = document.createElement('option');
                    option.value = coin.id;
                    option.textContent = `${coin.symbol.toUpperCase()} - ${coin.name}`;
                    datalist.appendChild(option);
                }
            });
        }
    } catch (error) {
        console.warn('Failed to fetch comprehensive coin list:', error);
        // Fallback to additional coins from Binance
        fetchAdditionalCoins(datalist);
    }
}

/**
 * Fetch additional coins from Binance API (for portfolio forms)
 * @param {HTMLElement} datalist - Datalist element to populate
 */
async function fetchAdditionalCoins(datalist) {
    try {
        const response = await fetch('https://api.binance.com/api/v3/exchangeInfo');
        const data = await response.json();
        
        if (data.symbols) {
            const usdtPairs = data.symbols
                .filter(s => s.symbol.endsWith('USDT') && s.status === 'TRADING')
                .map(s => s.symbol)
                .sort();
            
            // Add unique coins not already in popular list
            usdtPairs.forEach(coin => {
                if (!POPULAR_COINS.includes(coin)) {
                    const option = document.createElement('option');
                    option.value = coin;
                    datalist.appendChild(option);
                }
            });
        }
    } catch (error) {
        console.warn('Failed to fetch additional coins from Binance:', error);
        // Continue with popular coins only
    }
}

/**
 * Get current price for a coin pair
 * @param {string} symbol - Coin symbol (e.g., 'BTCUSDT')
 * @returns {Promise<number>} Current price
 */
async function getCoinPrice(symbol) {
    try {
        const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol.toUpperCase()}`);
        const data = await response.json();
        
        if (data.code === -1121) {
            throw new Error('Pair not found');
        }
        
        const price = parseFloat(data.askPrice || data.lastPrice);
        if (price <= 0.001) {
            return parseFloat(price.toFixed(8));
        }
        return parseFloat(price.toFixed(4));
    } catch (error) {
        console.error('Error fetching price:', error);
        throw error;
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initCoinDatalist, getCoinPrice, POPULAR_COINS };
}

