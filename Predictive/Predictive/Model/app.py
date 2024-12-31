from flask import Flask, jsonify, request, send_from_directory
import os
from Predictive.Predictive.Model.model1 import FirmPredictionModel
import json

app = Flask(__name__, static_folder='../frontend/static', template_folder='../frontend')

# Create an instance of FirmPredictionModel
firm_model = FirmPredictionModel("mongodb://localhost:27017/firm_data")

# Load data from MongoDB
firm_model._prepare_data()

# Train the model
firm_model.train_model()

@app.route('/')
def index():
    # Serve the HTML page
    return send_from_directory('../frontend', 'index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        input_data = [data['revenue'], data['expenses'], data['market_cap']]  # Remove the extra list wrapping
        prediction = firm_model.predict(input_data)  # Pass input_data directly
        print(json.dumps({'prediction': prediction.tolist()}))
        return jsonify({'prediction': prediction[0]})
    except KeyError:
        return jsonify({'error': 'Invalid input data'}), 400

if __name__ == '__main__':
    app.run(debug=True)