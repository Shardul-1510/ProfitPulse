import datetime
from flask import Flask, jsonify, request
from flask_mail import Mail, Message
from flask_restful import Api, Resource
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
import pymongo
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
import matplotlib.pyplot as plt
import io
import base64
from flask_cors import CORS
from textblob import TextBlob

app = Flask(__name__)
CORS(app)
api = Api(app)

CORS(app, resources={r"/*": {"origins": "http://localhost:3001"}})

# MongoDB connection setup
client = pymongo.MongoClient('mongodb://localhost:27017/')
firm_db = client['firm_data']
firm_collection = firm_db['financial_data']
profit_collection = firm_db['firm_prediction']

# Email configuration
app.config['MAIL_SERVER'] = "smtp.gmail.com"
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = "aayushshah342@gmail.com"
app.config['MAIL_PASSWORD'] = "dqpz bbev rmge ptku"
mail = Mail(app)

# Firm Prediction Model
class FirmPredictionModel:
    def __init__(self):
        self.model = LinearRegression()
        self.scaler = StandardScaler()
        self._prepare_data()

    def _prepare_data(self):
        # Load data from MongoDB
        data = pd.DataFrame(list(firm_collection.find()))
        X = data[['revenue', 'expenses', 'market_cap']]
        y = data['profit']
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        self.X_train = self.scaler.fit_transform(X_train)
        self.X_test = self.scaler.transform(X_test)
        self.y_train = y_train
        self.y_test = y_test

    def train_model(self):
        self.model.fit(self.X_train, self.y_train)

    def predict(self, input_data):
        input_data_scaled = self.scaler.transform([input_data])
        prediction = self.model.predict(input_data_scaled)[0]
        return {'prediction': float(prediction)}

# Profit Prediction Model
class ProfitPredictor:
    def __init__(self):
        self.model = None
        self.scaler_X = StandardScaler()
        self.scaler_y = StandardScaler()
        self.label_encoder = LabelEncoder()
        self._prepare_data()
    
    def _prepare_data(self):
        # Load data from MongoDB
        data = pd.DataFrame(list(profit_collection.find()))
        
        # Handle categorical variable (State)
        data['state'] = self.label_encoder.fit_transform(data['state'])
        
        # Split features and target
        X = data[['randspend', 'admincost', 'marketspend', 'state']]
        y = data['Profit']
        
        # Scale the data
        self.X = self.scaler_X.fit_transform(X)
        self.y = self.scaler_y.fit_transform(y.values.reshape(-1, 1))

    def build_model(self, input_dim):
        self.model = Sequential([
            Dense(64, activation='relu', input_dim=input_dim),
            Dropout(0.2),
            Dense(32, activation='relu'),
            Dropout(0.2),
            Dense(16, activation='relu'),
            Dense(1)
        ])
        self.model.compile(optimizer='adam', loss='mse', metrics=['mae'])

    def train(self, epochs=100):
        # Split data
        X_train, X_val, y_train, y_val = train_test_split(self.X, self.y, test_size=0.2, random_state=42)
        history = self.model.fit(
            X_train, y_train,
            validation_data=(X_val, y_val),
            epochs=epochs,
            batch_size=8,
            verbose=1
        )
        return history

    def predict(self, input_data):
        X_scaled = self.scaler_X.transform([input_data])
        predictions_scaled = self.model.predict(X_scaled)
        return {'prediction': float(self.scaler_y.inverse_transform(predictions_scaled)[0][0])}

    def plot_training_history(self, history):
        plt.figure(figsize=(12, 4))
        plt.subplot(1, 2, 1)
        plt.plot(history.history['loss'], label='Training Loss')
        plt.plot(history.history['val_loss'], label='Validation Loss')
        plt.title('Model Loss')
        plt.xlabel('Epoch')
        plt.ylabel('Loss')
        plt.legend()
        
        plt.subplot(1, 2, 2)
        plt.plot(history.history['mae'], label='Training MAE')
        plt.plot(history.history['val_mae'], label='Validation MAE')
        plt.title('Model MAE')
        plt.xlabel('Epoch')
        plt.ylabel('MAE')
        plt.legend()
        
        # Save plot to a PNG in memory
        img = io.BytesIO()
        plt.savefig(img, format='png')
        img.seek(0)
        plot_url = base64.b64encode(img.getvalue()).decode()
        plt.close()
        
        return plot_url

# Initialize models
firm_model = FirmPredictionModel()
profit_predictor = ProfitPredictor()
firm_model.train_model()
profit_predictor.build_model(input_dim=4)  # 4 features
profit_history = profit_predictor.train()

# API Resources
class FirmPredictionResource(Resource):
    def post(self):
        data = request.get_json()
        revenue = data['revenue']
        expenses = data['expenses']
        market_cap = data['market_cap']
        input_data = [revenue, expenses, market_cap]
        prediction = firm_model.predict(input_data)
        return {'prediction': prediction}

class ProfitPredictionResource(Resource):
    def post(self):
        data = request.get_json()
        r_d_spend = data['randspend']
        administration = data['admincost']
        marketing_spend = data['marketspend']
        state = profit_predictor.label_encoder.transform([data['state']])[0]
        input_data = [r_d_spend, administration, marketing_spend, state]
        prediction = profit_predictor.predict(input_data)
        return {'prediction': prediction}

    def get(self):
        plot_url = profit_predictor.plot_training_history(profit_history)
        return {'training_plot': plot_url}

@app.route('/api/feedback', methods=['POST'])
def submit_feedback():
    data = request.json
    
    # Analyze sentiment
    analysis = TextBlob(data['feedback'])
    # sentiment = 'positive' if analysis.sentiment.polarity > 0 else 'negative' if analysis.sentiment.polarity < 0 else 'neutral'
    polarity = analysis.sentiment.polarity
    print(f"Polarity: {polarity}")  # Debugging line to print polarity value
    sentiment = 'positive' if polarity > 0.1 else 'critical' if polarity < -0.1 else 'neutral'
    print(f"Sentiment: {sentiment}")
    
    # Send email if provided
    if data.get('email'):
        try:
            msg = Message(
                'Feedback Received - ProfitPulse Insights',
                sender='aayushshah342@gmail.com',
                recipients=[data['email']]
            )
            msg.body = f"""
            Thank you for your valuable feedback!
            
            We have received your feedback in the category: {data['category']}
            
            Your feedback: {data['feedback']}
            
            We appreciate your input and will use it to improve our services.

            This is an automated mail, please do not reply to this email.
            """
            mail.send(msg)
        except Exception as e:
            print(f"Failed to send email: {e}")
    
    # Store feedback in your database
    feedback_id = store_feedback(data, sentiment)
    
    return jsonify({
        'success': True,
        'feedbackId': feedback_id,
        'sentiment': sentiment
    })
    

def store_feedback(data, sentiment):
    pass

# Add Resources
api.add_resource(FirmPredictionResource, '/predict_firm')
api.add_resource(ProfitPredictionResource, '/predict_profit')

if __name__ == '__main__':
    app.run(debug=True, port=3000)
