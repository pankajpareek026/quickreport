/**
 * Coin Details Page JavaScript
 * Handles charts, calculators, and portfolio integration
 */

let priceChart = null;
let currentDays = 7;

/**
 * Initialize page
 */
document.addEventListener('DOMContentLoaded', function() {
    if (!window.coinData) {
        console.error('Coin data not available');
        return;
    }

    initializeChart();
    initializeCalculators();
    initializePortfolioModal();
    setupChartControls();
});

/**
 * Initialize price chart
 */
async function initializeChart() {
    const canvas = document.getElementById('priceChart');
    if (!canvas) {
        console.warn('Chart canvas not found');
        return;
    }

    // If no price history, fetch it
    if (!window.priceHistory || !window.priceHistory.prices || window.priceHistory.prices.length === 0) {
        console.warn('Price history not available, fetching...');
        if (window.coinData && window.coinData.id) {
            await updateChart(7); // Fetch 7 days by default
        } else {
            console.error('Coin data not available for chart');
            // Show placeholder message
            const chartContainer = document.querySelector('.chart-container');
            if (chartContainer) {
                chartContainer.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 50px;">Chart data not available</p>';
            }
            return;
        }
    }

    const ctx = canvas.getContext('2d');
    
    // Format data for Chart.js
    const prices = window.priceHistory.prices || [];
    if (prices.length === 0) {
        console.warn('No price data available');
        return;
    }

    const labels = prices.map(([timestamp]) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit' });
    });
    const priceData = prices.map(([, price]) => price);

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(248, 134, 5, 0.3)');
    gradient.addColorStop(1, 'rgba(248, 134, 5, 0)');

    // Get computed CSS color values (Chart.js can't read CSS variables)
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim() || '#f88605';
    const textSecondary = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim() || '#979191';

    priceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Price (USD)',
                data: priceData,
                borderColor: primaryColor,
                backgroundColor: gradient,
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: primaryColor,
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        label: function(context) {
                            return '$' + context.parsed.y.toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 6
                            });
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: textSecondary,
                        maxRotation: 45,
                        minRotation: 45
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: textSecondary,
                        callback: function(value) {
                            return '$' + value.toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            });
                        }
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

/**
 * Setup chart period controls
 */
function setupChartControls() {
    const chartButtons = document.querySelectorAll('.chart-btn');
    
    chartButtons.forEach(btn => {
        btn.addEventListener('click', async function() {
            const days = parseInt(this.dataset.days);
            
            // Update active state
            chartButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Fetch new data
            await updateChart(days);
        });
    });
}

/**
 * Update chart with new period
 */
async function updateChart(days) {
    if (!window.coinData || !priceChart) return;
    
    try {
        // Note: Don't specify 'interval' parameter for free tier
        // CoinGecko automatically returns hourly data for days 2-90
        // For days > 90, it returns daily data automatically
        const response = await fetch(
            `https://api.coingecko.com/api/v3/coins/${window.coinData.id}/market_chart?vs_currency=usd&days=${days}`
        );
        const data = await response.json();
        
        if (data.prices && data.prices.length > 0) {
            const prices = data.prices;
            const labels = prices.map(([timestamp]) => {
                const date = new Date(timestamp);
                if (days <= 7) {
                    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit' });
                } else {
                    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                }
            });
            const priceData = prices.map(([, price]) => price);
            
            priceChart.data.labels = labels;
            priceChart.data.datasets[0].data = priceData;
            priceChart.update();
            
            currentDays = days;
        }
    } catch (error) {
        console.error('Error updating chart:', error);
    }
}

/**
 * Initialize calculators
 */
function initializeCalculators() {
    if (!window.coinData) return;
    
    // Crypto converter
    const convertBtn = document.getElementById('convertBtn');
    const swapBtn = document.getElementById('swapCalc');
    const cryptoAmount = document.getElementById('cryptoAmount');
    const cryptoFrom = document.getElementById('cryptoFrom');
    const cryptoTo = document.getElementById('cryptoTo');
    const cryptoResult = document.getElementById('cryptoResult');
    
    if (convertBtn) {
        convertBtn.addEventListener('click', function() {
            performConversion();
        });
    }
    
    if (swapBtn) {
        swapBtn.addEventListener('click', function() {
            const fromValue = cryptoFrom.value;
            const toValue = cryptoTo.value;
            cryptoFrom.value = toValue;
            cryptoTo.value = fromValue;
            performConversion();
        });
    }
    
    // Auto-convert on input change
    if (cryptoAmount) {
        cryptoAmount.addEventListener('input', function() {
            if (this.value) {
                performConversion();
            }
        });
    }
    
    // Investment calculator
    const investmentBtn = document.getElementById('calculateInvestmentBtn');
    if (investmentBtn) {
        investmentBtn.addEventListener('click', calculateInvestment);
    }
}

/**
 * Perform currency conversion
 */
function performConversion() {
    const cryptoAmount = document.getElementById('cryptoAmount');
    const cryptoFrom = document.getElementById('cryptoFrom');
    const cryptoTo = document.getElementById('cryptoTo');
    const cryptoResult = document.getElementById('cryptoResult');
    
    if (!cryptoAmount || !cryptoFrom || !cryptoTo || !cryptoResult) return;
    
    const amount = parseFloat(cryptoAmount.value);
    if (!amount || amount <= 0) {
        cryptoResult.value = '';
        return;
    }
    
    const fromType = cryptoFrom.value;
    const toType = cryptoTo.value;
    const currentPrice = window.coinData.currentPrice;
    
    let result;
    
    if (fromType === 'crypto' && toType === 'usd') {
        result = amount * currentPrice;
    } else if (fromType === 'usd' && toType === 'crypto') {
        result = amount / currentPrice;
    } else {
        result = amount;
    }
    
    cryptoResult.value = result.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 8
    });
}

/**
 * Fetch historical price for a given coin and date.
 * Primary:  CoinGecko /history (works within past 365 days).
 * Fallback: CryptoCompare histoday (free, no API key, full multi-year history).
 */
async function fetchHistoricalPrice(coinId, symbol, dateObj, formattedDate) {
    // --- Primary: CoinGecko ---
    try {
        const cgResponse = await fetch(
            `https://api.coingecko.com/api/v3/coins/${coinId}/history?date=${formattedDate}`
        );
        if (cgResponse.ok) {
            const cgData = await cgResponse.json();
            if (cgData.market_data && cgData.market_data.current_price && cgData.market_data.current_price.usd) {
                return cgData.market_data.current_price.usd;
            }
        }
        // 401 / error 10012 → fall through to CryptoCompare
    } catch (e) {
        console.warn('CoinGecko historical fetch failed, trying CryptoCompare...', e);
    }

    // --- Fallback: CryptoCompare histoday (no API key needed) ---
    const toTs = Math.floor(dateObj.getTime() / 1000) + 86400; // end-of-day timestamp
    const ccUrl = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${symbol}&tsym=USD&limit=1&toTs=${toTs}`;
    const ccResponse = await fetch(ccUrl);
    if (!ccResponse.ok) throw new Error('Could not fetch historical price from any source');
    const ccData = await ccResponse.json();
    if (
        ccData.Response === 'Success' &&
        ccData.Data && ccData.Data.Data && ccData.Data.Data.length > 0
    ) {
        const dayData = ccData.Data.Data[ccData.Data.Data.length - 1];
        if (dayData.close && dayData.close > 0) return dayData.close;
    }
    throw new Error('Historical price not available for this date');
}

/**
 * Calculate investment returns
 */
async function calculateInvestment() {
    const investmentAmount = document.getElementById('investmentAmount');
    const investmentDate = document.getElementById('investmentDate');
    const investmentResult = document.getElementById('investmentResult');
    const investmentValue = document.getElementById('investmentValue');
    const investmentPL = document.getElementById('investmentPL');
    
    // New result fields
    const investedAmountDisplay = document.getElementById('investedAmountDisplay');
    const historicalPriceDisplay = document.getElementById('historicalPriceDisplay');
    const coinsPurchasedDisplay = document.getElementById('coinsPurchasedDisplay');
    const breakdownSteps = document.getElementById('breakdownSteps');
    
    if (!investmentAmount || !investmentDate || !investmentResult) return;
    
    const amount = parseFloat(investmentAmount.value);
    const dateStr = investmentDate.value;
    
    if (!amount || amount <= 0 || !dateStr) {
        Swal.fire({
            icon: 'warning',
            title: 'Invalid Input',
            text: 'Please enter both investment amount and date',
            confirmButtonColor: 'var(--primary-color)'
        });
        return;
    }
    
    const calculateBtn = document.getElementById('calculateInvestmentBtn');
    const originalText = calculateBtn.innerHTML;
    calculateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Calculating...';
    calculateBtn.disabled = true;
    
    try {
        const dateObj = new Date(dateStr);
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const year = dateObj.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;
        const coinSymbol = window.coinData.symbol.toUpperCase();

        const historicalPrice = await fetchHistoricalPrice(
            window.coinData.id, coinSymbol, dateObj, formattedDate
        );

        const currentPrice = window.coinData.currentPrice;
            
        // Calculate
        const coinsBought = amount / historicalPrice;
        const currentValue = coinsBought * currentPrice;
        const profitLoss = currentValue - amount;
        const profitLossPercent = ((currentValue - amount) / amount) * 100;
        
        // Update primary results
        investedAmountDisplay.textContent = '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2 });
        historicalPriceDisplay.textContent = '$' + historicalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 });
        coinsPurchasedDisplay.textContent = coinsBought.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 8 }) + ' ' + coinSymbol;
        
        investmentValue.textContent = '$' + currentValue.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        
        const plClass = profitLoss >= 0 ? 'positive' : 'negative';
        investmentPL.className = 'result-value ' + plClass;
        investmentPL.textContent = (profitLoss >= 0 ? '+' : '') + '$' + profitLoss.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }) + ' (' + (profitLossPercent >= 0 ? '+' : '') + profitLossPercent.toFixed(2) + '%)';
        
        // Generate breakdown steps
        breakdownSteps.innerHTML = `
            <li><strong>Step 1:</strong> Calculate coins purchased. <br> 
                <code>$${amount} (Invested) ÷ $${historicalPrice.toFixed(4)} (Price on ${formattedDate}) = ${coinsBought.toFixed(6)} ${coinSymbol}</code>
            </li>
            <li><strong>Step 2:</strong> Calculate current value. <br> 
                <code>${coinsBought.toFixed(6)} ${coinSymbol} × $${currentPrice.toFixed(4)} (Current Price) = $${currentValue.toFixed(2)}</code>
            </li>
            <li><strong>Step 3:</strong> Calculate Profit/Loss. <br> 
                <code>$${currentValue.toFixed(2)} (Value) - $${amount} (Invested) = $${profitLoss.toFixed(2)} (${profitLossPercent.toFixed(2)}%)</code>
            </li>
        `;
        
        investmentResult.style.display = 'block';
    } catch (error) {
        console.error('Investment calculation error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Calculation Error',
            text: error.message || 'Could not fetch historical price data. Please try a different date.',
            confirmButtonColor: 'var(--primary-color)'
        });
    } finally {
        calculateBtn.innerHTML = originalText;
        calculateBtn.disabled = false;
    }
}

/**
 * Initialize portfolio modal
 */
function initializePortfolioModal() {
    if (!window.isAuthenticated || !window.coinData) return;
    
    const addBtn = document.getElementById('addToPortfolioBtn');
    const modal = document.getElementById('addToPortfolioModal');
    const closeBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelModal');
    const form = document.getElementById('addToPortfolioForm');
    const coinNameInput = document.getElementById('modalCoinName');
    const priceInput = document.getElementById('modalPrice');
    
    if (!addBtn || !modal) return;
    
    // Set coin name and current price
    if (coinNameInput) {
        coinNameInput.value = window.coinData.symbol.toUpperCase() + 'USDT';
    }
    
    if (priceInput) {
        priceInput.value = window.coinData.currentPrice;
    }
    
    // Open modal
    addBtn.addEventListener('click', function() {
        modal.style.display = 'flex';
    });
    
    // Close modal
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    // Close on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Auto-calculate total cost
    const unitsInput = form.querySelector('input[name="units"]');
    const totalsInput = form.querySelector('input[name="totals"]');
    const priceInputField = form.querySelector('input[name="price"]');
    
    if (unitsInput && priceInputField && totalsInput) {
        function calculateTotal() {
            const units = parseFloat(unitsInput.value) || 0;
            const price = parseFloat(priceInputField.value) || 0;
            const total = units * price;
            totalsInput.value = total.toFixed(2);
        }
        
        unitsInput.addEventListener('input', calculateTotal);
        priceInputField.addEventListener('input', calculateTotal);
    }
}

