function makePrediction() {
    // Get input values
    const revenue = document.getElementById('revenue').value;
    const expenses = document.getElementById('expenses').value;
    const marketCap = document.getElementById('marketCap').value;

    // Create data object
    const data = {
        revenue: parseFloat(revenue),
        expenses: parseFloat(expenses),
        market_cap: parseFloat(marketCap)
    };

    // Send POST request to the Flask app
    fetch('/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.error) {
            document.getElementById('predictionResult').innerText = 'Error: ' + result.error;
        } else {
            // Display the prediction
            document.getElementById('predictionResult').innerText = `Predicted Profit: ${result.prediction}`;
        }
    })
    .catch(error => console.error('Error:', error));
}
