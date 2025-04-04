document.addEventListener('DOMContentLoaded', () => {
    const amountInput = document.getElementById('amount');
    const fromCurrency = document.getElementById('from-currency');
    const toCurrency = document.getElementById('to-currency');
    const resultInput = document.getElementById('result');
    const convertButton = document.getElementById('convert');

    const API_KEY = 'ae765de5579cfbdd2d63d902'; // Your API key

    convertButton.addEventListener('click', () => {
        const amount = parseFloat(amountInput.value);
        const from = fromCurrency.value;
        const to = toCurrency.value;

        if (isNaN(amount)) {
            alert('Please enter a valid amount');
            return;
        }

        // Use from as the base currency in the API call
        const API_URL = `https://v6.exchangerate-api.com/v6/64621c8635d92eb0dce5d455/latest/${from}`  // `E:/code/javascript/currency conv/apifetch.txt`  // `https://v6.exchangerate-api.com/v6/64621c8635d92eb0dce5d455/latest/usd` //`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${from};`
        
        fetch(API_URL)
            .then(response => response.json())
            .then(data => {
                if (!data.conversion_rates[to]) {
                    alert('Invalid currency selection');
                    return;
                }

                const rate = data.conversion_rates[to];
                console.log(`amount: ${amount}`)
                console.log(`rate: ${rate}`)
                const convertedAmount = (amount * rate).toFixed(4);
                resultInput.value = `${convertedAmount}`;// ${to}`;
            })

            .catch(error => {
                console.error('Error fetching conversion rate:', error);
                alert('Error fetching exchange rates. Please try again.');
               
            });
            // const rate = 87;
            // const convertedAmount = (amount * rate).toFixed(2);
            // resultInput.value = `${convertedAmount} ${to}`;
    });
});