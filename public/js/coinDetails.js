/**
 * CoinGecko Details Modal
 * Fetches comprehensive coin details when user clicks on coin icon
 */

/**
 * Fetch comprehensive coin details from CoinGecko
 * @param {string} coinId - CoinGecko coin ID
 */
async function fetchCoinDetails(coinId) {
    try {
        const response = await fetch(
            `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=true&sparkline=false`
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch coin details');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching coin details:', error);
        throw error;
    }
}

/**
 * Format large numbers
 */
function formatNumber(num) {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toFixed(2);
}

/**
 * Format percentage
 */
function formatPercentage(num) {
    const sign = num >= 0 ? '+' : '';
    return `${sign}${num.toFixed(2)}%`;
}

/**
 * Show coin details modal
 * @param {string} coinId - CoinGecko coin ID
 * @param {string} coinName - Coin name
 * @param {string} coinSymbol - Coin symbol
 * @param {string} coinImage - Coin image URL
 */
async function showCoinDetailsModal(coinId, coinName, coinSymbol, coinImage) {
    try {
        // Show loading
        Swal.fire({
            title: 'Loading...',
            html: 'Fetching coin details from CoinGecko',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        const data = await fetchCoinDetails(coinId);
        const marketData = data.market_data;
        const communityData = data.community_data;
        const developerData = data.developer_data;

        // Build modal HTML
        const modalHtml = `
            <div class="coin-details-modal">
                <div class="coin-details-header-section">
                    <img src="${data.image.large}" alt="${coinName}" class="coin-details-large-image">
                    <div class="coin-details-title">
                        <h2>${data.name} (${data.symbol.toUpperCase()})</h2>
                        <p class="coin-rank">Rank #${data.market_cap_rank || 'N/A'}</p>
                    </div>
                </div>

                <div class="coin-details-price-section">
                    <div class="current-price-large">
                        $${marketData.current_price.usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                    </div>
                    <div class="price-change-24h ${marketData.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}">
                        ${formatPercentage(marketData.price_change_percentage_24h)} (24h)
                    </div>
                </div>

                <div class="coin-details-stats-grid">
                    <div class="stat-item">
                        <span class="stat-label">Market Cap</span>
                        <span class="stat-value">$${formatNumber(marketData.market_cap.usd)}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Volume (24h)</span>
                        <span class="stat-value">$${formatNumber(marketData.total_volume.usd)}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Circulating Supply</span>
                        <span class="stat-value">${formatNumber(marketData.circulating_supply)} ${data.symbol.toUpperCase()}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Total Supply</span>
                        <span class="stat-value">${marketData.total_supply ? formatNumber(marketData.total_supply) : 'N/A'} ${data.symbol.toUpperCase()}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">All-Time High</span>
                        <span class="stat-value">$${marketData.ath.usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">All-Time Low</span>
                        <span class="stat-value">$${marketData.atl.usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</span>
                    </div>
                </div>

                <div class="coin-details-price-changes">
                    <h3>Price Changes</h3>
                    <div class="price-changes-grid">
                        <div class="price-change-item">
                            <span>1h</span>
                            <span class="${marketData.price_change_percentage_1h_in_currency.usd >= 0 ? 'positive' : 'negative'}">
                                ${formatPercentage(marketData.price_change_percentage_1h_in_currency.usd)}
                            </span>
                        </div>
                        <div class="price-change-item">
                            <span>24h</span>
                            <span class="${marketData.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}">
                                ${formatPercentage(marketData.price_change_percentage_24h)}
                            </span>
                        </div>
                        <div class="price-change-item">
                            <span>7d</span>
                            <span class="${marketData.price_change_percentage_7d >= 0 ? 'positive' : 'negative'}">
                                ${formatPercentage(marketData.price_change_percentage_7d)}
                            </span>
                        </div>
                        <div class="price-change-item">
                            <span>30d</span>
                            <span class="${marketData.price_change_percentage_30d >= 0 ? 'positive' : 'negative'}">
                                ${formatPercentage(marketData.price_change_percentage_30d)}
                            </span>
                        </div>
                        <div class="price-change-item">
                            <span>1y</span>
                            <span class="${marketData.price_change_percentage_1y >= 0 ? 'positive' : 'negative'}">
                                ${formatPercentage(marketData.price_change_percentage_1y || 0)}
                            </span>
                        </div>
                    </div>
                </div>

                ${data.description.en ? `
                <div class="coin-details-description">
                    <h3>About ${data.name}</h3>
                    <p>${data.description.en.substring(0, 500)}${data.description.en.length > 500 ? '...' : ''}</p>
                </div>
                ` : ''}

                <div class="coin-details-actions">
                    <button class="btn-calculator" onclick="openCalculator('${coinId}', '${data.name}', '${data.symbol}', ${marketData.current_price.usd})">
                        <i class="fas fa-calculator"></i> Calculator
                    </button>
                    <button class="btn-investment-calc" onclick="openInvestmentCalculator('${coinId}', '${data.name}', '${data.symbol}', ${marketData.current_price.usd})">
                        <i class="fas fa-chart-line"></i> Investment Calculator
                    </button>
                </div>
            </div>
        `;

        Swal.fire({
            title: '',
            html: modalHtml,
            width: '90%',
            maxWidth: '800px',
            showConfirmButton: true,
            confirmButtonText: 'Close',
            confirmButtonColor: 'var(--primary-color)',
            customClass: {
                popup: 'coin-details-popup',
                htmlContainer: 'coin-details-container'
            }
        });

    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to fetch coin details. Please try again later.',
            confirmButtonColor: 'var(--primary-color)'
        });
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { showCoinDetailsModal, fetchCoinDetails };
}

