const axios = require('axios');

/**
 * Get coin details page
 * Fetches comprehensive coin data from CoinGecko
 */
const getCoinDetails = async (req, res) => {
  try {
    const coinId = req.params.id;
    const isAuthenticated = !!req.cookies.AUTH;
    
    if (!coinId) {
      return res.redirect('/');
    }

    // Fetch comprehensive coin data from CoinGecko
    const coinDataUrl = `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=true&sparkline=false`;
    
    let coinData = null;
    let marketData = null;
    let priceHistory = null;
    
    try {
      // Fetch main coin data
      console.log('='.repeat(80));
      console.log('[COIN DATA FETCH] Starting fetch...');
      console.log(`[COIN DATA FETCH] Coin ID: ${coinId}`);
      console.log(`[COIN DATA FETCH] URL: ${coinDataUrl}`);
      console.log(`[COIN DATA FETCH] Timestamp: ${new Date().toISOString()}`);
      
      const coinRequestStartTime = Date.now();
      const coinResponse = await axios.get(coinDataUrl, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'QuickReport/1.0'
        },
        timeout: 10000 // 10 second timeout
      });
      const coinRequestDuration = Date.now() - coinRequestStartTime;
      
      console.log(`[COIN DATA FETCH] Request completed in ${coinRequestDuration}ms`);
      console.log(`[COIN DATA FETCH] Response status: ${coinResponse.status}`);
      console.log(`[COIN DATA FETCH] Response headers:`, JSON.stringify(coinResponse.headers, null, 2));
      console.log(`[COIN DATA FETCH] ✅ Successfully fetched coin data`);
      console.log('='.repeat(80));
      
      coinData = coinResponse.data;
      
      // Fetch price history for charts (last 7 days for detailed chart)
      // Note: For free tier, don't specify 'interval' parameter
      // CoinGecko automatically returns hourly data for days 2-90
      // For days > 90, it returns daily data automatically
      const historyUrl = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=7`;
      
      console.log('='.repeat(80));
      console.log('[HISTORICAL DATA FETCH] Starting fetch...');
      console.log(`[HISTORICAL DATA FETCH] Coin ID: ${coinId}`);
      console.log(`[HISTORICAL DATA FETCH] URL: ${historyUrl}`);
      console.log(`[HISTORICAL DATA FETCH] Timestamp: ${new Date().toISOString()}`);
      
      try {
        // Add delay to avoid rate limiting
        console.log('[HISTORICAL DATA FETCH] Waiting 500ms before request...');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const requestConfig = {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'QuickReport/1.0'
          },
          timeout: 15000
        };
        
        console.log('[HISTORICAL DATA FETCH] Request config:', JSON.stringify(requestConfig, null, 2));
        console.log('[HISTORICAL DATA FETCH] Making GET request...');
        
        const requestStartTime = Date.now();
        const historyResponse = await axios.get(historyUrl, requestConfig);
        const requestDuration = Date.now() - requestStartTime;
        
        console.log(`[HISTORICAL DATA FETCH] Request completed in ${requestDuration}ms`);
        console.log(`[HISTORICAL DATA FETCH] Response status: ${historyResponse.status}`);
        console.log(`[HISTORICAL DATA FETCH] Response headers:`, JSON.stringify(historyResponse.headers, null, 2));
        console.log(`[HISTORICAL DATA FETCH] Response data keys:`, Object.keys(historyResponse.data || {}));
        
        if (historyResponse.data && historyResponse.data.prices) {
          console.log(`[HISTORICAL DATA FETCH] Price data points: ${historyResponse.data.prices.length}`);
          if (historyResponse.data.prices.length > 0) {
            console.log(`[HISTORICAL DATA FETCH] First price:`, historyResponse.data.prices[0]);
            console.log(`[HISTORICAL DATA FETCH] Last price:`, historyResponse.data.prices[historyResponse.data.prices.length - 1]);
          }
        }
        
        priceHistory = historyResponse.data;
        marketData = historyResponse.data;
        
        console.log('[HISTORICAL DATA FETCH] ✅ Successfully fetched price history');
        console.log('='.repeat(80));
        
      } catch (historyError) {
        const errorDetails = {
          message: historyError.message,
          code: historyError.code,
          response: null,
          request: null
        };
        
        if (historyError.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          errorDetails.response = {
            status: historyError.response.status,
            statusText: historyError.response.statusText,
            headers: historyError.response.headers,
            data: historyError.response.data
          };
          
          console.error('[HISTORICAL DATA FETCH] ❌ Response Error:');
          console.error(`[HISTORICAL DATA FETCH] Status: ${historyError.response.status} ${historyError.response.statusText}`);
          console.error(`[HISTORICAL DATA FETCH] Response Headers:`, JSON.stringify(historyError.response.headers, null, 2));
          console.error(`[HISTORICAL DATA FETCH] Response Data:`, JSON.stringify(historyError.response.data, null, 2));
          
          // Check for rate limit headers
          if (historyError.response.headers['x-ratelimit-limit']) {
            console.error(`[HISTORICAL DATA FETCH] Rate Limit Info:`);
            console.error(`[HISTORICAL DATA FETCH]   Limit: ${historyError.response.headers['x-ratelimit-limit']}`);
            console.error(`[HISTORICAL DATA FETCH]   Remaining: ${historyError.response.headers['x-ratelimit-remaining']}`);
            console.error(`[HISTORICAL DATA FETCH]   Reset: ${historyError.response.headers['x-ratelimit-reset']}`);
          }
        } else if (historyError.request) {
          // The request was made but no response was received
          errorDetails.request = {
            method: historyError.config?.method,
            url: historyError.config?.url,
            headers: historyError.config?.headers
          };
          
          console.error('[HISTORICAL DATA FETCH] ❌ Request Error (No Response):');
          console.error(`[HISTORICAL DATA FETCH] Request URL: ${historyError.config?.url}`);
          console.error(`[HISTORICAL DATA FETCH] Request Method: ${historyError.config?.method}`);
          console.error(`[HISTORICAL DATA FETCH] Request Headers:`, JSON.stringify(historyError.config?.headers, null, 2));
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('[HISTORICAL DATA FETCH] ❌ Setup Error:');
          console.error(`[HISTORICAL DATA FETCH] Error: ${historyError.message}`);
        }
        
        console.error('[HISTORICAL DATA FETCH] Full Error Object:', JSON.stringify(errorDetails, null, 2));
        console.error('[HISTORICAL DATA FETCH] Error Stack:', historyError.stack);
        
        // Check for specific error types
        if (historyError.response && historyError.response.status === 401) {
          const errorData = historyError.response.data;
          if (errorData?.status?.error_code === 10005) {
            console.error('[HISTORICAL DATA FETCH] ❌ ERROR: interval=hourly parameter is Enterprise plan only!');
            console.error('[HISTORICAL DATA FETCH] ❌ The URL should NOT contain interval parameter for free tier.');
            console.error('[HISTORICAL DATA FETCH] ❌ CoinGecko automatically returns hourly data for days 2-90.');
            console.error('[HISTORICAL DATA FETCH] ❌ Please restart the server to load updated code.');
          } else {
            console.warn('[HISTORICAL DATA FETCH] ⚠️ CoinGecko API authentication error. Chart will load via client-side fetch.');
          }
        } else if (historyError.response && historyError.response.status === 429) {
          console.warn('[HISTORICAL DATA FETCH] ⚠️ CoinGecko API rate limit reached. Chart will load via client-side fetch.');
        } else {
          console.warn('[HISTORICAL DATA FETCH] ⚠️ Price history fetch failed, continuing without it');
        }
        
        priceHistory = null;
        marketData = null;
        console.log('='.repeat(80));
      }
      
    } catch (apiError) {
      console.error('CoinGecko API error:', apiError.message);
      // If coin not found, redirect to home
      if (apiError.response && apiError.response.status === 404) {
        return res.redirect('/');
      }
      // If 401 (rate limit), show helpful message
      if (apiError.response && apiError.response.status === 401) {
        return res.render('coinDetails', {
          coinData: null,
          marketData: null,
          priceHistory: null,
          isAuthenticated,
          error: 'API rate limit exceeded. Please try again in a few moments.'
        });
      }
      // Otherwise, render with error message
      return res.render('coinDetails', {
        coinData: null,
        marketData: null,
        priceHistory: null,
        isAuthenticated,
        error: 'Failed to fetch coin data. Please try again later.'
      });
    }

    // Format data for view
    const formattedData = {
      id: coinData.id,
      name: coinData.name,
      symbol: coinData.symbol.toUpperCase(),
      image: coinData.image?.large || coinData.image?.small || '',
      description: coinData.description?.en || 'No description available',
      currentPrice: coinData.market_data?.current_price?.usd || 0,
      marketCap: coinData.market_data?.market_cap?.usd || 0,
      totalVolume: coinData.market_data?.total_volume?.usd || 0,
      circulatingSupply: coinData.market_data?.circulating_supply || 0,
      totalSupply: coinData.market_data?.total_supply || 0,
      maxSupply: coinData.market_data?.max_supply || null,
      ath: coinData.market_data?.ath?.usd || 0,
      athDate: coinData.market_data?.ath_date?.usd || null,
      atl: coinData.market_data?.atl?.usd || 0,
      atlDate: coinData.market_data?.atl_date?.usd || null,
      priceChange24h: coinData.market_data?.price_change_percentage_24h || 0,
      priceChange7d: coinData.market_data?.price_change_percentage_7d || 0,
      priceChange30d: coinData.market_data?.price_change_percentage_30d || 0,
      priceChange1y: coinData.market_data?.price_change_percentage_1y || 0,
      athChange: coinData.market_data?.ath_change_percentage?.usd || 0,
      atlChange: coinData.market_data?.atl_change_percentage?.usd || 0,
      rank: coinData.market_cap_rank || null,
      homepage: coinData.links?.homepage?.[0] || null,
      blockchainSite: coinData.links?.blockchain_site?.[0] || null,
      officialForum: coinData.links?.official_forum_url?.[0] || null,
      subreddit: coinData.links?.subreddit_url || null,
      twitter: coinData.links?.twitter_screen_name || null,
      github: coinData.links?.repos_url?.github?.[0] || null,
      contractAddress: coinData.contract_address || null,
      genesisDate: coinData.genesis_date || null,
      hashingAlgorithm: coinData.hashing_algorithm || null,
      categories: coinData.categories || [],
      platforms: coinData.platforms || {}
    };

    // Format price history for charts
    const chartData = priceHistory ? {
      prices: priceHistory.prices || [],
      marketCaps: priceHistory.market_caps || [],
      volumes: priceHistory.total_volumes || []
    } : null;

    // Format market data for sparklines
    const sparklineData = marketData ? {
      prices: marketData.prices || [],
      marketCaps: marketData.market_caps || [],
      volumes: marketData.total_volumes || []
    } : null;

    res.render('coinDetails', {
      coinData: formattedData,
      marketData: sparklineData,
      priceHistory: chartData,
      isAuthenticated,
      error: null
    });

  } catch (error) {
    console.error('Get coin details error:', error);
    res.render('coinDetails', {
      coinData: null,
      marketData: null,
      priceHistory: null,
      isAuthenticated: !!req.cookies.AUTH,
      error: 'An error occurred while fetching coin data.'
    });
  }
};

module.exports = {
  getCoinDetails
};

