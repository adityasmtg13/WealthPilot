from flask import Flask, render_template, request, jsonify
import json
from datetime import datetime, timedelta

app = Flask(__name__)

# Sample data storage (in a real app, use a database)
user_data = {
    "net_worth": 245876.90,
    "assets": {
        "stocks": 45,
        "bonds": 20,
        "real_estate": 25,
        "cash": 10
    },
    "transactions": [
        {"name": "Amazon Purchase", "date": "Today, 3:45 PM", "amount": -89.99, "type": "shopping"},
        {"name": "Salary Deposit", "date": "Jun 1, 9:00 AM", "amount": 8750.00, "type": "income"},
        {"name": "Mortgage Payment", "date": "May 30, 12:00 PM", "amount": -2350.00, "type": "housing"},
        {"name": "Dinner Out", "date": "May 28, 8:30 PM", "amount": -65.40, "type": "food"}
    ],
    "portfolio": {
        "value": 112456.78,
        "change": 2345.67,
        "change_percent": 2.13,
        "allocation": {
            "tech": 45,
            "healthcare": 15,
            "finance": 12,
            "consumer": 10,
            "energy": 8,
            "other": 10
        }
    },
    "watchlist": [
        {"symbol": "RELIANCE", "price": 2456.75, "change": 32.50, "change_percent": 1.34, "volume": "2.5M"},
        {"symbol": "TCS", "price": 3315.20, "change": -45.30, "change_percent": -1.35, "volume": "1.2M"},
        {"symbol": "HDFCBANK", "price": 1425.60, "change": 12.75, "change_percent": 0.90, "volume": "3.1M"},
        {"symbol": "INFY", "price": 1498.30, "change": 25.40, "change_percent": 1.72, "volume": "1.8M"},
        {"symbol": "BHARTIARTL", "price": 785.45, "change": -8.20, "change_percent": -1.03, "volume": "1.5M"}
    ],
    "trips": [
        {
            "name": "Summer Europe Vacation",
            "start_date": "2023-06-15",
            "end_date": "2023-07-05",
            "budget": 5000,
            "spent": 3250,
            "members": 4
        },
        {
            "name": "Weekend Ski Trip",
            "start_date": "2023-01-20",
            "end_date": "2023-01-22",
            "budget": 1200,
            "spent": 1200,
            "members": 6
        }
    ]
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/net-worth', methods=['GET'])
def get_net_worth():
    # In a real app, calculate this from actual data
    return jsonify({
        "current": user_data["net_worth"],
        "history": [
            {"month": "Jan", "value": 200000},
            {"month": "Feb", "value": 210000},
            {"month": "Mar", "value": 215000},
            {"month": "Apr", "value": 225000},
            {"month": "May", "value": 230000},
            {"month": "Jun", "value": 245876.90}
        ]
    })

@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    return jsonify(user_data["transactions"])

@app.route('/api/portfolio', methods=['GET'])
def get_portfolio():
    return jsonify(user_data["portfolio"])

@app.route('/api/watchlist', methods=['GET'])
def get_watchlist():
    return jsonify(user_data["watchlist"])

@app.route('/api/stock/<symbol>', methods=['GET'])
def get_stock(symbol):
    # Sample data for Indian stocks
    indian_stocks = {
        "RELIANCE": {
            "name": "Reliance Industries Ltd",
            "price": 2456.75,
            "change": 32.50,
            "change_percent": 1.34,
            "market_cap": "15.2T",
            "pe_ratio": 24.15,
            "dividend_yield": 0.45,
            "week52_high": 2580.00,
            "week52_low": 2105.50,
            "beta": 1.15,
            "eps": 101.75,
            "revenue": "7.5T",
            "description": "Reliance Industries Limited is an Indian multinational conglomerate company headquartered in Mumbai.",
            "chart_data": {
                "labels": ["9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "1:00", "1:30", "2:00", "2:30", "3:00", "3:30", "4:00"],
                "prices": [2420.50, 2432.20, 2438.80, 2445.50, 2442.20, 2448.80, 2452.20, 2455.50, 2453.30, 2456.60, 2455.40, 2453.30, 2455.45, 2456.75]
            }
        },
        "TCS": {
            "name": "Tata Consultancy Services Ltd",
            "price": 3315.20,
            "change": -45.30,
            "change_percent": -1.35,
            "market_cap": "12.1T",
            "pe_ratio": 30.25,
            "dividend_yield": 1.25,
            "week52_high": 3450.00,
            "week52_low": 2950.50,
            "beta": 0.85,
            "eps": 109.60,
            "revenue": "1.9T",
            "description": "Tata Consultancy Services is an Indian multinational information technology services and consulting company.",
            "chart_data": {
                "labels": ["9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "1:00", "1:30", "2:00", "2:30", "3:00", "3:30", "4:00"],
                "prices": [3350.50, 3342.20, 3338.80, 3335.50, 3332.20, 3328.80, 3325.20, 3320.50, 3318.30, 3316.60, 3315.40, 3315.30, 3315.25, 3315.20]
            }
        }
    }
    
    if symbol in indian_stocks:
        return jsonify(indian_stocks[symbol])
    else:
        return jsonify({"error": "Stock not found"}), 404
    
@app.route('/api/indian-market-news', methods=['GET'])
def get_indian_market_news():
    return jsonify([
        {
            "source": "Economic Times",
            "time": "2 hours ago",
            "title": "Nifty crosses 18,000 mark as IT stocks rally",
            "summary": "The Nifty 50 index crossed the 18,000 mark for the first time in a month as IT stocks gained on positive global cues."
        },
        {
            "source": "Business Standard",
            "time": "4 hours ago",
            "title": "RBI keeps repo rate unchanged at 6.5%",
            "summary": "The Reserve Bank of India maintained the status quo on key policy rates, signaling a balanced approach to inflation control and growth."
        },
        {
            "source": "Moneycontrol",
            "time": "6 hours ago",
            "title": "Reliance Jio reports 12% revenue growth in Q1",
            "summary": "Reliance Jio Infocomm reported a 12% year-on-year increase in revenue for the first quarter, beating analyst estimates."
        },
        {
            "source": "Livemint",
            "time": "8 hours ago",
            "title": "FPIs invest ₹12,500 crore in Indian equities in June",
            "summary": "Foreign portfolio investors turned net buyers in June after two months of outflows, injecting ₹12,500 crore into Indian equities."
        }
    ])

@app.route('/api/trips', methods=['GET', 'POST'])
def handle_trips():
    if request.method == 'POST':
        data = request.json
        new_trip = {
            "name": data.get("name"),
            "start_date": data.get("start_date"),
            "end_date": data.get("end_date"),
            "budget": data.get("budget"),
            "spent": 0,
            "members": data.get("members", [])
        }
        user_data["trips"].append(new_trip)
        return jsonify({"success": True, "trip": new_trip})
    else:
        return jsonify(user_data["trips"])

@app.route('/api/calculate/taxes', methods=['POST'])
def calculate_taxes():
    data = request.json
    gross_salary = float(data.get("gross_salary", 0))
    state = data.get("state", "CA")
    filing_status = data.get("filing_status", "single")
    
    # Simplified tax calculation
    federal_tax = gross_salary * 0.22  # Approximate average
    state_tax = gross_salary * 0.06    # Approximate average
    social_security = gross_salary * 0.062
    medicare = gross_salary * 0.0145
    
    total_taxes = federal_tax + state_tax + social_security + medicare
    net_income = gross_salary - total_taxes
    
    return jsonify({
        "federal_tax": federal_tax,
        "state_tax": state_tax,
        "social_security": social_security,
        "medicare": medicare,
        "total_taxes": total_taxes,
        "net_income": net_income,
        "monthly_income": net_income / 12
    })

@app.route('/api/calculate/emi', methods=['POST'])
def calculate_emi():
    data = request.json
    loan_amount = float(data.get("loan_amount", 0))
    interest_rate = float(data.get("interest_rate", 0))
    loan_term = int(data.get("loan_term", 0))
    
    monthly_rate = interest_rate / 100 / 12
    num_payments = loan_term * 12
    
    # EMI formula: P * r * (1+r)^n / ((1+r)^n - 1)
    emi = loan_amount * monthly_rate * (1 + monthly_rate)**num_payments / ((1 + monthly_rate)**num_payments - 1)
    total_interest = (emi * num_payments) - loan_amount
    
    return jsonify({
        "emi": emi,
        "total_interest": total_interest,
        "total_payment": emi * num_payments,
        "principal": loan_amount
    })

if __name__ == '__main__':
    app.run(debug=True)
