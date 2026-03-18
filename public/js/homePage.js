/**
 * Home Page Functionality
 * Optimized and production-grade JavaScript for index.ejs
 */

// Global state
const HomePageState = {
    deviceWidth: window.innerWidth,
    currentCurrency: 'usd',
    coinsData: [],
    gainCount: 0,
    lossCount: 0,
    marketSituation: 0,
    isLoading: false
};

/**
 * Initialize home page
 */
function initHomePage() {
    checkInternetConnection();
    loadFearAndGreedIndex();
    loadCoinsData();
    setupSearch();
    setupCurrencySelector();
    setupResponsiveHandlers();
}

/**
 * Check internet connection
 */
function checkInternetConnection() {
    if (!navigator.onLine) {
        document.body.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; background-color: var(--bg-primary); color: var(--error-color); text-align: center; padding: 20px;">
                <i class="fas fa-wifi" style="font-size: 4rem; margin-bottom: 20px;"></i>
                <h1>No Internet Connection</h1>
                <p style="color: var(--text-secondary); margin: 20px 0;">Please check your internet connection and try again.</p>
                <button onclick="window.location.reload()" class="btn btn-primary" style="margin-top: 20px;">
                    <i class="fas fa-redo"></i> Reload
                </button>
            </div>
        `;
    }
}

/**
 * Load Fear and Greed Index
 */
async function loadFearAndGreedIndex() {
    try {
        const response = await fetch('https://api.alternative.me/fng/');
        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
            const fngData = data.data[0];
            const fngElement = document.getElementById('feargreed');
            const nameElement = document.getElementById('fngName');
            
            if (fngElement && nameElement) {
                nameElement.textContent = `${fngData.value} - ${fngData.value_classification}`;
                
                // Set color based on classification
                const colorMap = {
                    'Extreme Fear': 'var(--error-color)',
                    'Fear': 'var(--warning-color)',
                    'Neutral': 'var(--text-secondary)',
                    'Greed': 'var(--success-color)',
                    'Extreme Greed': 'var(--success-color)'
                };
                
                fngElement.style.color = colorMap[fngData.value_classification] || 'var(--text-secondary)';
            }
        }
    } catch (error) {
        console.error('Error loading Fear & Greed Index:', error);
    }
}

/**
 * Setup search functionality
 */
function setupSearch() {
    const searchInput = document.getElementById('search');
    const searchButton = document.getElementById('submitID');
    
    if (!searchInput || !searchButton) return;
    
    // Disable button initially
    searchButton.disabled = true;
    searchButton.style.opacity = '0.6';
    
    // Enable/disable based on input length
    searchInput.addEventListener('input', function() {
        const value = this.value.trim();
        if (value.length >= 3) {
            searchButton.disabled = false;
            searchButton.style.opacity = '1';
            searchButton.style.backgroundColor = 'var(--primary-color)';
        } else {
            searchButton.disabled = true;
            searchButton.style.opacity = '0.6';
            searchButton.style.backgroundColor = 'var(--text-secondary)';
        }
    });
    
    // Handle search on button click
    searchButton.addEventListener('click', handleSearch);
    
    // Handle Enter key
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !searchButton.disabled) {
            handleSearch();
        }
    });
}

/**
 * Handle search
 */
async function handleSearch() {
    const searchInput = document.getElementById('search');
    const searchValue = searchInput.value.trim();
    
    if (!searchValue || searchValue.length < 3) {
        Swal.fire({
            icon: 'warning',
            title: 'Invalid Search',
            text: 'Please enter at least 3 characters',
            confirmButtonColor: 'var(--primary-color)'
        });
        return;
    }
    
    try {
        Swal.fire({
            title: 'Searching...',
            html: 'Fetching coin data',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        
        const response = await fetch(
            `https://api.coingecko.com/api/v3/coins/${searchValue}?localization=false&community_data=false&developer_data=false`
        );
        
        if (!response.ok) {
            throw new Error('Coin not found');
        }
        
        const data = await response.json();
        const priceChange = parseFloat(data.market_data.price_change_percentage_24h).toFixed(2);
        const changeClass = priceChange >= 0 ? 'positive' : 'negative';
        
        // Navigate to coin details page
        window.location.href = `/coin/${data.id}`;
        
    } catch (error) {
        console.error('Search error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Coin Not Found',
            text: `Could not find coin "${searchValue}". Please check the spelling and try again.`,
            confirmButtonColor: 'var(--primary-color)'
        });
    }
}

/**
 * Setup currency selector
 */
function setupCurrencySelector() {
    const currencySelect = document.getElementById('currency');
    if (currencySelect) {
        currencySelect.addEventListener('change', function() {
            HomePageState.currentCurrency = this.value;
            loadCoinsData();
        });
    }
}

/**
 * Load coins data from CoinGecko
 */
async function loadCoinsData() {
    const loader = document.getElementById('loader');
    const tableBody = document.querySelector('#MainTable tbody');
    
    if (!tableBody) return;
    
    // Show loader
    if (loader) loader.style.display = 'flex';
    HomePageState.isLoading = true;
    
    // Reset counts
    HomePageState.gainCount = 0;
    HomePageState.lossCount = 0;
    HomePageState.marketSituation = 0;
    
    // Clear table
    tableBody.innerHTML = '';
    
    try {
        const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${HomePageState.currentCurrency}&order=market_cap_desc&per_page=250&page=1&sparkline=false`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Failed to fetch coins data');
        }
        
        const data = await response.json();
        HomePageState.coinsData = data;
        
        // Render coins
        data.forEach((coin, index) => {
            renderCoinRow(coin, index);
            
            // Hide loader after first 50 coins
            if (index === 50 && loader) {
                loader.style.display = 'none';
            }
        });
        
        // Update gain/loss counters
        updateGainLossCounters();
        
        // Hide loader
        if (loader) loader.style.display = 'none';
        HomePageState.isLoading = false;
        
    } catch (error) {
        console.error('Error loading coins:', error);
        if (loader) loader.style.display = 'none';
        HomePageState.isLoading = false;
        
        Swal.fire({
            icon: 'error',
            title: 'Error Loading Data',
            text: 'Failed to load cryptocurrency data. Please try again later.',
            confirmButtonColor: 'var(--primary-color)'
        });
    }
}

/**
 * Render coin row
 */
function renderCoinRow(coin, index) {
    const tableBody = document.querySelector('#MainTable tbody');
    if (!tableBody) return;
    
    const priceChange = parseFloat(coin.price_change_percentage_24h || 0);
    const isGain = priceChange >= 0;
    
    // Update counters
    if (isGain) {
        HomePageState.gainCount++;
    } else {
        HomePageState.lossCount++;
    }
    HomePageState.marketSituation += priceChange;
    
    // Format data
    const formattedPrice = formatPrice(coin.current_price);
    const formattedVolume = formatVolume(coin.total_volume);
    const formattedATH = formatPrice(coin.ath);
    const formattedATHChange = parseFloat(coin.ath_change_percentage || 0).toFixed(2);
    const formattedDate = formatDate(coin.ath_date);
    
    // Create row
    const row = document.createElement('tr');
    row.className = 'coin-row';
    row.style.cursor = 'pointer';
    
    // Add click handler to entire row
    row.addEventListener('click', function(e) {
        // Don't navigate if clicking on a button or link
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.closest('button') || e.target.closest('a')) {
            return;
        }
        // Navigate to coin details page
        window.location.href = `/coin/${coin.id}`;
    });
    
    // Create cells
    const rankCell = document.createElement('td');
    rankCell.className = 'rank-cell';
    rankCell.textContent = coin.market_cap_rank || 'N/A';
    
    const coinCell = document.createElement('td');
    coinCell.className = 'coin-cell';
    
    // Create coin image
    const img = document.createElement('img');
    img.src = coin.image;
    img.alt = coin.name;
    img.className = 'coin-icon';
    img.title = 'Click for details';
    img.style.cursor = 'pointer';
    img.style.pointerEvents = 'auto';
    
    const symbolSpan = document.createElement('span');
    symbolSpan.className = 'coin-symbol';
    symbolSpan.textContent = coin.symbol.toUpperCase();
    
    coinCell.appendChild(img);
    coinCell.appendChild(symbolSpan);
    
    const priceCell = document.createElement('td');
    priceCell.className = 'price-cell';
    priceCell.textContent = formattedPrice;
    
    const changeCell = document.createElement('td');
    changeCell.className = `change-cell ${isGain ? 'positive' : 'negative'}`;
    changeCell.textContent = `${isGain ? '+' : ''}${priceChange.toFixed(2)}%`;
    
    const volumeCell = document.createElement('td');
    volumeCell.className = 'volume-cell';
    volumeCell.setAttribute('data-title', '24h Volume');
    volumeCell.textContent = formattedVolume;
    
    const athCell = document.createElement('td');
    athCell.className = 'ath-cell';
    athCell.textContent = formattedATH;
    
    const athChangeCell = document.createElement('td');
    athChangeCell.className = `ath-change-cell ${formattedATHChange < 0 ? 'negative' : 'positive'}`;
    athChangeCell.setAttribute('data-title', 'Down from ATH');
    athChangeCell.textContent = `${formattedATHChange}%`;
    
    const athDateCell = document.createElement('td');
    athDateCell.className = 'ath-date-cell';
    athDateCell.textContent = formattedDate;
    
    // Append all cells to row
    row.appendChild(rankCell);
    row.appendChild(coinCell);
    row.appendChild(priceCell);
    row.appendChild(changeCell);
    row.appendChild(volumeCell);
    row.appendChild(athCell);
    row.appendChild(athChangeCell);
    row.appendChild(athDateCell);
    
    // Store current price for calculators
    row.dataset.coinId = coin.id;
    row.dataset.coinPrice = coin.current_price;
    
    tableBody.appendChild(row);
}

/**
 * Get currency symbol for the currently selected currency
 */
function getCurrencySymbol() {
    const symbolMap = {
        usd: '$',
        eur: '€',
        inr: '₹'
    };
    return symbolMap[HomePageState.currentCurrency] || '$';
}

/**
 * Format price
 */
function formatPrice(price) {
    if (!price) return 'N/A';
    const sym = getCurrencySymbol();
    
    if (price >= 1000000) {
        return `${sym}${(price / 1000000).toFixed(3)}M`;
    } else if (price >= 1000) {
        return `${sym}${(price / 1000).toFixed(2)}K`;
    } else {
        return `${sym}${price.toFixed(6)}`;
    }
}

/**
 * Format volume
 */
function formatVolume(volume) {
    if (!volume) return 'N/A';
    const sym = getCurrencySymbol();
    
    if (volume >= 1000000000) {
        return `${sym}${(volume / 1000000000).toFixed(2)}B`;
    } else if (volume >= 1000000) {
        return `${sym}${(volume / 1000000).toFixed(2)}M`;
    } else if (volume >= 1000) {
        return `${sym}${(volume / 1000).toFixed(2)}K`;
    } else {
        return `${sym}${volume.toFixed(2)}`;
    }
}

/**
 * Format date
 */
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = String(date.getDate()).padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day}-${month}-${year}`;
}

/**
 * Update gain/loss counters
 */
function updateGainLossCounters() {
    const gainInput = document.getElementById('gain');
    const lossInput = document.getElementById('loss');
    
    if (gainInput) {
        gainInput.value = `${HomePageState.gainCount} ▲`;
    }
    
    if (lossInput) {
        lossInput.value = `${HomePageState.lossCount} ▼`;
    }
}

/**
 * Setup responsive handlers
 */
function setupResponsiveHandlers() {
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            HomePageState.deviceWidth = window.innerWidth;
            applyResponsiveStyles();
        }, 250);
    });
    
    // Initial responsive setup
    applyResponsiveStyles();
}

/**
 * Apply responsive styles
 */
function applyResponsiveStyles() {
    const table = document.getElementById('MainTable');
    const isMobile = HomePageState.deviceWidth <= 768;
    
    if (table) {
        if (isMobile) {
            table.classList.add('mobile-table');
        } else {
            table.classList.remove('mobile-table');
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initHomePage();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initHomePage, loadCoinsData, handleSearch };
}

