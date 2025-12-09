/**
 * Investment Calculator
 * Calculate: If invested X amount on selected date, what would it be worth now?
 */

/**
 * Get historical price from CoinGecko
 * @param {string} coinId - CoinGecko coin ID
 * @param {string} date - Date in DD-MM-YYYY format
 */
async function getHistoricalPrice(coinId, date) {
    try {
        // Convert DD-MM-YYYY to timestamp
        const [day, month, year] = date.split('-');
        const timestamp = Math.floor(new Date(year, month - 1, day).getTime() / 1000);
        
        const response = await fetch(
            `https://api.coingecko.com/api/v3/coins/${coinId}/history?date=${day}-${month}-${year}`
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch historical price');
        }
        
        const data = await response.json();
        return data.market_data.current_price.usd;
    } catch (error) {
        console.error('Error fetching historical price:', error);
        throw error;
    }
}

/**
 * Open investment calculator modal
 * @param {string} coinId - CoinGecko coin ID
 * @param {string} coinName - Coin name
 * @param {string} coinSymbol - Coin symbol
 * @param {number} currentPrice - Current price in USD
 */
function openInvestmentCalculator(coinId, coinName, coinSymbol, currentPrice) {
    const today = new Date();
    const maxDate = today.toISOString().split('T')[0];
    const minDate = new Date(today.getFullYear() - 10, 0, 1).toISOString().split('T')[0];

    const calculatorHtml = `
        <div class="investment-calculator">
            <div class="calculator-header">
                <h3><i class="fas fa-chart-line"></i> ${coinName} Investment Calculator</h3>
                <p class="current-price-display">Current Price: $${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</p>
            </div>

            <div class="calculator-form">
                <div class="input-group">
                    <label><i class="fas fa-dollar-sign"></i> Investment Amount (USD)</label>
                    <input type="number" id="invAmount" placeholder="Enter investment amount" step="any" min="0" oninput="calculateInvestmentReturn()">
                </div>
                
                <div class="input-group">
                    <label><i class="fas fa-calendar"></i> Investment Date</label>
                    <input type="date" id="invDate" min="${minDate}" max="${maxDate}" onchange="calculateInvestmentReturn()">
                </div>

                <div class="input-group">
                    <button class="btn-calculate" onclick="calculateInvestmentReturn()">
                        <i class="fas fa-calculator"></i> Calculate
                    </button>
                </div>

                <div id="investmentResult" class="result-display" style="display: none;">
                    <div class="result-box">
                        <h4>Investment Results</h4>
                        <div class="result-item">
                            <span class="result-label">Initial Investment:</span>
                            <span class="result-value" id="initialInvestment">$0.00</span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">Price on Investment Date:</span>
                            <span class="result-value" id="historicalPrice">$0.00</span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">Coins Purchased:</span>
                            <span class="result-value" id="coinsPurchased">0 ${coinSymbol.toUpperCase()}</span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">Current Value:</span>
                            <span class="result-value positive" id="currentValue">$0.00</span>
                        </div>
                        <div class="result-item highlight">
                            <span class="result-label">Profit/Loss:</span>
                            <span class="result-value" id="profitLoss">$0.00 (0%)</span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">Return Percentage:</span>
                            <span class="result-value" id="returnPercentage">0%</span>
                        </div>
                    </div>
                </div>

                <div id="investmentLoading" class="loading-message" style="display: none;">
                    <i class="fas fa-spinner fa-spin"></i> Fetching historical data...
                </div>

                <div id="investmentError" class="error-message" style="display: none;">
                    <i class="fas fa-exclamation-circle"></i> <span id="errorText"></span>
                </div>
            </div>
        </div>
    `;

    Swal.fire({
        title: '',
        html: calculatorHtml,
        width: '90%',
        maxWidth: '700px',
        showConfirmButton: true,
        confirmButtonText: 'Close',
        confirmButtonColor: 'var(--primary-color)',
        customClass: {
            popup: 'investment-calculator-popup',
            htmlContainer: 'investment-calculator-container'
        }
    });

    // Store coin data for calculations
    window.investmentCalcData = {
        coinId,
        coinName,
        coinSymbol,
        currentPrice
    };
}

/**
 * Calculate investment return
 */
async function calculateInvestmentReturn() {
    const amount = parseFloat(document.getElementById('invAmount')?.value) || 0;
    const dateInput = document.getElementById('invDate')?.value;
    const resultDiv = document.getElementById('investmentResult');
    const loadingDiv = document.getElementById('investmentLoading');
    const errorDiv = document.getElementById('investmentError');

    // Hide previous results
    if (resultDiv) resultDiv.style.display = 'none';
    if (errorDiv) errorDiv.style.display = 'none';

    if (amount <= 0) {
        if (errorDiv) {
            errorDiv.style.display = 'block';
            document.getElementById('errorText').textContent = 'Please enter a valid investment amount';
        }
        return;
    }

    if (!dateInput) {
        if (errorDiv) {
            errorDiv.style.display = 'block';
            document.getElementById('errorText').textContent = 'Please select an investment date';
        }
        return;
    }

    const calcData = window.investmentCalcData;
    if (!calcData) {
        if (errorDiv) {
            errorDiv.style.display = 'block';
            document.getElementById('errorText').textContent = 'Calculator data not available';
        }
        return;
    }

    // Show loading
    if (loadingDiv) loadingDiv.style.display = 'block';

    try {
        // Convert date to DD-MM-YYYY format
        const date = new Date(dateInput);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;

        // Fetch historical price
        const historicalPrice = await getHistoricalPrice(calcData.coinId, formattedDate);
        
        // Calculate results
        const coinsPurchased = amount / historicalPrice;
        const currentValue = coinsPurchased * calcData.currentPrice;
        const profitLoss = currentValue - amount;
        const returnPercentage = ((currentValue - amount) / amount) * 100;

        // Display results
        if (resultDiv) {
            document.getElementById('initialInvestment').textContent = `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            document.getElementById('historicalPrice').textContent = `$${historicalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`;
            document.getElementById('coinsPurchased').textContent = `${coinsPurchased.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })} ${calcData.coinSymbol.toUpperCase()}`;
            document.getElementById('currentValue').textContent = `$${currentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            
            const profitLossElement = document.getElementById('profitLoss');
            const returnPercentageElement = document.getElementById('returnPercentage');
            
            if (profitLoss >= 0) {
                profitLossElement.textContent = `+$${profitLoss.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (+${returnPercentage.toFixed(2)}%)`;
                profitLossElement.className = 'result-value positive';
                returnPercentageElement.textContent = `+${returnPercentage.toFixed(2)}%`;
                returnPercentageElement.className = 'result-value positive';
            } else {
                profitLossElement.textContent = `$${profitLoss.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${returnPercentage.toFixed(2)}%)`;
                profitLossElement.className = 'result-value negative';
                returnPercentageElement.textContent = `${returnPercentage.toFixed(2)}%`;
                returnPercentageElement.className = 'result-value negative';
            }
            
            resultDiv.style.display = 'block';
        }

    } catch (error) {
        console.error('Error calculating investment return:', error);
        if (errorDiv) {
            errorDiv.style.display = 'block';
            document.getElementById('errorText').textContent = 'Failed to fetch historical data. Please try again later.';
        }
    } finally {
        if (loadingDiv) loadingDiv.style.display = 'none';
    }
}

