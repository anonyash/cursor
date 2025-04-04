// Fallback exchange rates (as of a recent date)
const fallbackRates = {
    USD: { EUR: 0.92, GBP: 0.79, JPY: 151.37, INR: 83.25, CAD: 1.35, CHF: 0.90, CNY: 7.24 },
    EUR: { USD: 1.09, GBP: 0.86, JPY: 164.53, INR: 90.49, CAD: 1.47, CHF: 0.98, CNY: 7.87 },
    GBP: { USD: 1.27, EUR: 1.16, JPY: 191.31, INR: 105.22, CAD: 1.71, CHF: 1.14, CNY: 9.15 },
    JPY: { USD: 0.0066, EUR: 0.0061, GBP: 0.0052, INR: 0.55, CAD: 0.0089, CHF: 0.0060, CNY: 0.048 },
    INR: { USD: 0.012, EUR: 0.011, GBP: 0.0095, JPY: 1.82, CAD: 0.016, CHF: 0.011, CNY: 0.087 },
    CAD: { USD: 0.74, EUR: 0.68, GBP: 0.58, JPY: 112.13, INR: 61.48, CHF: 0.67, CNY: 5.37 },
    CHF: { USD: 1.11, EUR: 1.02, GBP: 0.87, JPY: 167.08, INR: 91.67, CAD: 1.49, CNY: 8.01 },
    CNY: { USD: 0.14, EUR: 0.13, GBP: 0.11, JPY: 20.91, INR: 11.47, CAD: 0.19, CHF: 0.12 }
};

// DOM Elements
const amountInput = document.getElementById('amount');
const fromCurrency = document.getElementById('from-currency');
const toCurrency = document.getElementById('to-currency');
const resultInput = document.getElementById('result');
const swapBtn = document.getElementById('swap-btn');
const statusDiv = document.getElementById('status');
const fetchRatesBtn = document.getElementById('fetch-rates-btn');
const lastFetchDiv = document.getElementById('last-fetch');

// Use fallback rates as the default saved rates
let savedRates = fallbackRates;
let lastFetchTime = null;

// Format date and time
function formatDateTime(timestamp) {
    if (!timestamp) return '2 April, 2025';
    
    const date = new Date(timestamp);
    return date.toLocaleString();
}

// Update last fetch time display
function updateLastFetchTime() {
    lastFetchDiv.textContent = `Last updated: ${formatDateTime(lastFetchTime)}`;
}

// Fetch exchange rates from API and update saved rates
async function fetchExchangeRates() {
    try {
        fetchRatesBtn.disabled = true;
        fetchRatesBtn.textContent = 'Fetching...';
        
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        if (!response.ok) throw new Error('Failed to fetch rates');
        
        const data = await response.json();
        
        // Convert API response to our format
        const newRates = {};
        const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'INR', 'CAD', 'CHF', 'CNY'];
        
        // Create a mapping of USD to other currencies
        for (const currency of currencies) {
            if (currency === 'USD') continue;
            if (!newRates['USD']) newRates['USD'] = {};
            newRates['USD'][currency] = data.rates[currency];
        }
        
        // Create mappings for other currencies
        for (const fromCurrency of currencies) {
            if (fromCurrency === 'USD') continue;
            
            newRates[fromCurrency] = {};
            for (const toCurrency of currencies) {
                if (toCurrency === fromCurrency) continue;
                
                if (toCurrency === 'USD') {
                    // Direct conversion to USD
                    newRates[fromCurrency]['USD'] = 1 / data.rates[fromCurrency];
                } else {
                    // Convert through USD
                    newRates[fromCurrency][toCurrency] = (1 / data.rates[fromCurrency]) * data.rates[toCurrency];
                }
            }
        }
        
        // Update saved rates
        savedRates = newRates;
        lastFetchTime = Date.now();
        updateStatus('Rates updated successfully');
        updateLastFetchTime();
        return true;
    } catch (error) {
        console.error('Error fetching rates:', error);
        updateStatus('Failed to fetch rates. Using existing rates.');
        return false;
    } finally {
        fetchRatesBtn.disabled = false;
        fetchRatesBtn.textContent = 'Update Rates';
    }
}

// Convert currency using saved rates
function convertCurrency(amount, from, to) {
    if (from === to) return amount;
    
    if (from === 'USD') {
        return amount * savedRates[from][to];
    } else if (to === 'USD') {
        return amount / savedRates[to][from];
    } else {
        // Convert to USD first, then to target currency
        const usdAmount = amount / savedRates[to][from];
        return usdAmount * savedRates['USD'][to];
    }
}

// Update the conversion result
function updateConversion() {
    const amount = parseFloat(amountInput.value) || 0;
    const from = fromCurrency.value;
    const to = toCurrency.value;
    
    const result = convertCurrency(amount, from, to);
    resultInput.value = result.toFixed(2);
}

// Update status message
function updateStatus(message) {
    statusDiv.textContent = message;
}

// Initialize the converter
function initializeConverter() {
    // Set up event listeners for real-time updates
    amountInput.addEventListener('input', updateConversion);
    fromCurrency.addEventListener('change', updateConversion);
    toCurrency.addEventListener('change', updateConversion);
    
    // Add input event listeners for currency selects to update on typing
    fromCurrency.addEventListener('input', updateConversion);
    toCurrency.addEventListener('input', updateConversion);
    
    // Add event listener for fetch rates button
    fetchRatesBtn.addEventListener('click', async () => {
        await fetchExchangeRates();
        updateConversion();
    });
    
    swapBtn.addEventListener('click', () => {
        const temp = fromCurrency.value;
        fromCurrency.value = toCurrency.value;
        toCurrency.value = temp;
        updateConversion();
    });
    
    // Initial conversion
    updateConversion();
    updateLastFetchTime();
}

// Start the converter
initializeConverter(); 