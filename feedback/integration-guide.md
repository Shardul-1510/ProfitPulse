# Integration Guide for ProfitPulse Insights Hub

## Backend Setup

1. Install required packages:
```bash
pip install -r backend-requirements.txt
```

2. Create a new route in your Flask app:

```python
from flask import Flask, request, jsonify
from flask_mail import Mail, Message
from flask_cors import CORS
from textblob import TextBlob

app = Flask(__name__)
CORS(app)

# Email configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'aayush.shah@mitwpu.edu.in'
app.config['MAIL_PASSWORD'] = 'mkwcbqbxpfbvbpka'
mail = Mail(app)

@app.route('/api/feedback', methods=['POST'])
def submit_feedback():
    data = request.json
    
    # Analyze sentiment
    analysis = TextBlob(data['feedback'])
    sentiment = 'positive' if analysis.sentiment.polarity > 0 else 'negative' if analysis.sentiment.polarity < 0 else 'neutral'
    
    # Send email if provided
    if data.get('email'):
        try:
            msg = Message(
                'Feedback Received - ProfitPulse Insights',
                sender='aayush.shah@mitwpu.edu.in',
                recipients=[data['email']]
            )
            msg.body = f"""
            Thank you for your feedback!
            
            We have received your feedback in the category: {data['category']}
            
            Your feedback: {data['feedback']}
            
            We appreciate your input and will use it to improve our services.
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
    # Implement your database storage logic here
    pass

if __name__ == '__main__':
    app.run(debug=True)
```

## Integration Steps

1. Add the feedback routes to your existing Flask application
2. Configure email settings in your `.env` file
3. Create a new database table for feedback:

```sql
CREATE TABLE feedback (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    sentiment VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    upvotes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

4. Mount the React components in your existing frontend:
   - Copy the provided React components to your project
   - Add the required dependencies to your package.json
   - Import and use the components where needed

## Notes

- The feedback system is designed to work independently but can access prediction data
- Email notifications require valid SMTP credentials
- The frontend uses local storage for upvotes to prevent multiple votes
- Real-time updates are handled through the Zustand store