from flask import Flask, jsonify, request
from flask_restful import Api, Resource
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import pymongo


class FirmPredictionModel:
    def __init__(self):
        self.client = pymongo.MongoClient('mongodb://localhost:27017/')
        self.db = self.client['firm_data']
        self.collection = self.db['financial_data']
        self.model = None
        self.scaler = StandardScaler()
        self._prepare_data()

    def _prepare_data(self):
        data = self.collection.find()
        data = pd.DataFrame(list(data))
        X = data[['revenue', 'expenses', 'market_cap']]
        y = data['profit']
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        self.X_train = self.scaler.fit_transform(X_train)
        self.X_test = self.scaler.transform(X_test)
        self.y_train = y_train
        self.y_test = y_test

    def train_model(self):
        self.model = LinearRegression()
        self.model.fit(self.X_train, self.y_train)

    def predict(self, input_data):
        input_data_scaled = self.scaler.transform([input_data])
        prediction = self.model.predict(input_data_scaled)[0]
        return {'prediction': float(prediction)}


app = Flask(__name__)
api = Api(app)

firm_model = FirmPredictionModel()
firm_model.train_model()

class PredictionResource(Resource):
    def post(self):
        print("Received request:", request.get_json())
        try:
            data = request.get_json()
            print(data)
            revenue = data['revenue']
            expenses = data['expenses']
            market_cap = data['market_cap']
            input_data = [revenue, expenses, market_cap]
            prediction = firm_model.predict(input_data)
            # Return the dictionary directly, Flask will convert it to JSON
            return {'prediction': prediction}
        except Exception as e:
            # Return the error message as a dictionary
            return {'error': str(e)}, 500
        except:
            # Return a general error if something unexpected happens
            return {'error': 'An unexpected error occurred'}, 500


api.add_resource(PredictionResource, '/predict')

if __name__ == '__main__':
    app.run(debug=True,port=3000)