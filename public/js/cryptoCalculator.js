/**
 * Cryptocurrency Calculator
 * Similar to CoinMarketCap and CoinGecko calculators
 */

/**
 * Open cryptocurrency calculator modal
 * @param {string} coinId - CoinGecko coin ID
 * @param {string} coinName - Coin name
 * @param {string} coinSymbol - Coin symbol
 * @param {number} currentPrice - Current price in USD
 */
function openCalculator(coinId, coinName, coinSymbol, currentPrice) {
    const calculatorHtml = `
        <div class="crypto-calculator">
            <div class="calculator-header">
                <h3><i class="fas fa-calculator"></i> ${coinName} Calculator</h3>
                <p class="current-price-display">Current Price: $${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</p>
            </div>

            <div class="calculator-tabs">
                <button class="tab-btn active" onclick="switchCalculatorTab('convert')">Convert</button>
                <button class="tab-btn" onclick="switchCalculatorTab('calculate')">Calculate</button>
            </div>

            <div id="convertTab" class="calculator-tab active">
                <div class="calculator-form">
                    <div class="input-group">
                        <label>Amount</label>
                        <input type="number" id="convertAmount" placeholder="Enter amount" step="any" min="0" oninput="calculateConvert()">
                    </div>
                    <div class="input-group">
                        <label>From</label>
                        <select id="convertFrom" onchange="calculateConvert()">
                            <option value="${coinSymbol.toUpperCase()}">${coinSymbol.toUpperCase()}</option>
                            <option value="USD">USD</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label>To</label>
                        <select id="convertTo" onchange="calculateConvert()">
                            <option value="USD">USD</option>
                            <option value="${coinSymbol.toUpperCase()}">${coinSymbol.toUpperCase()}</option>
                        </select>
                    </div>
                    <div class="result-display" id="convertResult">
                        <p>Result will appear here</p>
                    </div>
                </div>
            </div>

            <div id="calculateTab" class="calculator-tab">
                <div class="calculator-form">
                    <div class="input-group">
                        <label>Investment Amount (USD)</label>
                        <input type="number" id="investAmount" placeholder="Enter investment amount" step="any" min="0" oninput="calculateInvestment()">
                    </div>
                    <div class="input-group">
                        <label>Price per ${coinSymbol.toUpperCase()}</label>
                        <input type="number" id="investPrice" value="${currentPrice}" step="any" min="0" oninput="calculateInvestment()">
                    </div>
                    <div class="result-display" id="investResult">
                        <p>You would get: <strong id="investCoins">0</strong> ${coinSymbol.toUpperCase()}</p>
                        <p>Total Value: $<strong id="investValue">0.00</strong></p>
                    </div>
                </div>
            </div>
        </div>
    `;

    Swal.fire({
        title: '',
        html: calculatorHtml,
        width: '90%',
        maxWidth: '600px',
        showConfirmButton: true,
        confirmButtonText: 'Close',
        confirmButtonColor: 'var(--primary-color)',
        customClass: {
            popup: 'calculator-popup',
            htmlContainer: 'calculator-container'
        }
    });

    // Initialize calculations
    calculateConvert();
    calculateInvestment();
}

/**
 * Switch calculator tabs
 */
function switchCalculatorTab(tab) {
    document.querySelectorAll('.calculator-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    
    if (tab === 'convert') {
        document.getElementById('convertTab').classList.add('active');
        document.querySelectorAll('.tab-btn')[0].classList.add('active');
    } else {
        document.getElementById('calculateTab').classList.add('active');
        document.querySelectorAll('.tab-btn')[1].classList.add('active');
    }
}

/**
 * Calculate conversion
 */
function calculateConvert() {
    const amount = parseFloat(document.getElementById('convertAmount')?.value) || 0;
    const from = document.getElementById('convertFrom')?.value;
    const to = document.getElementById('convertTo')?.value;
    const resultDiv = document.getElementById('convertResult');
    
    if (!resultDiv || amount <= 0) {
        if (resultDiv) resultDiv.innerHTML = '<p>Enter an amount to convert</p>';
        return;
    }

    // Get current price from the page context or use stored value
    const currentPrice = window.currentCoinPrice || 0;
    
    let result = 0;
    let resultText = '';

    if (from === to) {
        result = amount;
        resultText = `${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })} ${from}`;
    } else if (from === 'USD' && to !== 'USD') {
        result = amount / currentPrice;
        resultText = `${result.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })} ${to}`;
    } else if (from !== 'USD' && to === 'USD') {
        result = amount * currentPrice;
        resultText = `$${result.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    resultDiv.innerHTML = `
        <div class="result-box">
            <p class="result-label">Result:</p>
            <p class="result-value">${resultText}</p>
        </div>
    `;
}

/**
 * Calculate investment
 */
function calculateInvestment() {
    const amount = parseFloat(document.getElementById('investAmount')?.value) || 0;
    const price = parseFloat(document.getElementById('investPrice')?.value) || 0;
    const coinsDiv = document.getElementById('investCoins');
    const valueDiv = document.getElementById('investValue');
    
    if (!coinsDiv || !valueDiv || amount <= 0 || price <= 0) {
        if (coinsDiv) coinsDiv.textContent = '0';
        if (valueDiv) valueDiv.textContent = '0.00';
        return;
    }

    const coins = amount / price;
    const currentPrice = window.currentCoinPrice || price;
    const currentValue = coins * currentPrice;

    coinsDiv.textContent = coins.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 });
    valueDiv.textContent = currentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

