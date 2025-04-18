from flask import Flask, request, jsonify, session, redirect, url_for
from flask_cors import CORS
import sqlite3
from datetime import datetime, timedelta
import math

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'
CORS(app)

# Database setup
def init_db():
    conn = sqlite3.connect('wealthpilot.db')
    c = conn.cursor()
    
    # Create tables if they don't exist
    c.execute('''CREATE TABLE IF NOT EXISTS users
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                 username TEXT UNIQUE NOT NULL,
                 password TEXT NOT NULL,
                 email TEXT UNIQUE NOT NULL,
                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)''')
    
    c.execute('''CREATE TABLE IF NOT EXISTS net_worth
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                 user_id INTEGER NOT NULL,
                 date DATE NOT NULL,
                 value REAL NOT NULL,
                 FOREIGN KEY(user_id) REFERENCES users(id))''')
    
    c.execute('''CREATE TABLE IF NOT EXISTS transactions
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                 user_id INTEGER NOT NULL,
                 date DATE NOT NULL,
                 description TEXT NOT NULL,
                 amount REAL NOT NULL,
                 category TEXT NOT NULL,
                 FOREIGN KEY(user_id) REFERENCES users(id))''')
    
    c.execute('''CREATE TABLE IF NOT EXISTS trips
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                 user_id INTEGER NOT NULL,
                 name TEXT NOT NULL,
                 start_date DATE NOT NULL,
                 end_date DATE NOT NULL,
                 budget REAL NOT NULL,
                 FOREIGN KEY(user_id) REFERENCES users(id))''')
    
    c.execute('''CREATE TABLE IF NOT EXISTS trip_members
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                 trip_id INTEGER NOT NULL,
                 name TEXT NOT NULL,
                 email TEXT NOT NULL,
                 phone TEXT NOT NULL,
                 FOREIGN KEY(trip_id) REFERENCES trips(id))''')
    
    c.execute('''CREATE TABLE IF NOT EXISTS trip_expenses
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                 trip_id INTEGER NOT NULL,
                 user_id INTEGER NOT NULL,
                 date DATE NOT NULL,
                 description TEXT NOT NULL,
                 amount REAL NOT NULL,
                 category TEXT NOT NULL,
                 FOREIGN KEY(trip_id) REFERENCES trips(id),
                 FOREIGN KEY(user_id) REFERENCES users(id))''')
    
    conn.commit()
    conn.close()

init_db()

# Helper functions
def get_db_connection():
    conn = sqlite3.connect('wealthpilot.db')
    conn.row_factory = sqlite3.Row
    return conn

# Authentication routes
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')  # In production, use proper password hashing
    
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE username = ? AND password = ?',
                        (username, password)).fetchone()
    conn.close()
    
    if user is None:
        return jsonify({'error': 'Invalid username or password'}), 401
    
    session['user_id'] = user['id']
    return jsonify({'message': 'Logged in successfully', 'user': dict(user)})

@app.route('/api/logout')
def logout():
    session.pop('user_id', None)
    return jsonify({'message': 'Logged out successfully'})

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    
    if not username or not password or not email:
        return jsonify({'error': 'Missing required fields'}), 400
    
    conn = get_db_connection()
    try:
        conn.execute('INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
                     (username, password, email))
        conn.commit()
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({'error': 'Username or email already exists'}), 400
    finally:
        conn.close()
    
    return jsonify({'message': 'User registered successfully'})

# Dashboard routes
@app.route('/api/net-worth', methods=['GET'])
def get_net_worth():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    conn = get_db_connection()
    net_worth = conn.execute('SELECT date, value FROM net_worth WHERE user_id = ? ORDER BY date DESC LIMIT 6',
                             (session['user_id'],)).fetchall()
    conn.close()
    
    return jsonify({'net_worth': [dict(row) for row in net_worth]})

@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    conn = get_db_connection()
    transactions = conn.execute('SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC LIMIT 10',
                               (session['user_id'],)).fetchall()
    conn.close()
    
    return jsonify({'transactions': [dict(row) for row in transactions]})

# Tax calculator
@app.route('/api/calculate-taxes', methods=['POST'])
def calculate_taxes():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    data = request.get_json()
    gross_salary = float(data.get('gross_salary', 0))
    state = data.get('state', 'CA')
    filing_status = data.get('filing_status', 'single')
    
    # Simplified tax calculation
    federal_tax = gross_salary * 0.15
    state_tax = gross_salary * 0.06
    social_security = gross_salary * 0.062
    medicare = gross_salary * 0.0145
    
    # Adjust based on filing status
    if filing_status == 'married_joint':
        federal_tax = gross_salary * 0.12
    elif filing_status == 'head':
        federal_tax = gross_salary * 0.13
    
    # Adjust state tax based on selected state
    if state == 'CA':
        state_tax = gross_salary * 0.07
    elif state == 'TX':
        state_tax = 0  # Texas has no state income tax
    
    total_tax = federal_tax + state_tax + social_security + medicare
    net_annual_income = gross_salary - total_tax
    
    return jsonify({
        'federal_tax': federal_tax,
        'state_tax': state_tax,
        'social_security': social_security,
        'medicare': medicare,
        'total_tax': total_tax,
        'net_annual_income': net_annual_income
    })

# EMI calculator
@app.route('/api/calculate-emi', methods=['POST'])
def calculate_emi():
    data = request.get_json()
    loan_amount = float(data.get('loan_amount', 0))
    interest_rate = float(data.get('interest_rate', 0))
    loan_term = int(data.get('loan_term', 0))
    
    monthly_rate = interest_rate / 100 / 12
    num_payments = loan_term * 12
    
    if monthly_rate == 0:
        emi = loan_amount / num_payments
    else:
        emi = loan_amount * monthly_rate * (1 + monthly_rate)**num_payments / ((1 + monthly_rate)**num_payments - 1)
    
    total_payment = emi * num_payments
    total_interest = total_payment - loan_amount
    
    return jsonify({
        'monthly_payment': emi,
        'total_interest': total_interest,
        'total_payment': total_payment
    })

# Trip planner routes
@app.route('/api/trips', methods=['GET'])
def get_trips():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    conn = get_db_connection()
    trips = conn.execute('SELECT * FROM trips WHERE user_id = ? ORDER BY start_date DESC',
                         (session['user_id'],)).fetchall()
    
    # Get trip members and expenses for each trip
    trip_data = []
    for trip in trips:
        trip_dict = dict(trip)
        
        # Get members
        members = conn.execute('SELECT * FROM trip_members WHERE trip_id = ?',
                              (trip['id'],)).fetchall()
        trip_dict['members'] = [dict(member) for member in members]
        
        # Get expenses
        expenses = conn.execute('SELECT * FROM trip_expenses WHERE trip_id = ?',
                               (trip['id'],)).fetchall()
        trip_dict['expenses'] = [dict(expense) for expense in expenses]
        
        # Calculate total spent
        total_spent = sum(expense['amount'] for expense in trip_dict['expenses'])
        trip_dict['total_spent'] = total_spent
        
        trip_data.append(trip_dict)
    
    conn.close()
    return jsonify({'trips': trip_data})

@app.route('/api/trips', methods=['POST'])
def create_trip():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    data = request.get_json()
    name = data.get('name')
    start_date = data.get('start_date')
    end_date = data.get('end_date')
    budget = float(data.get('budget', 0))
    members = data.get('members', [])
    
    if not name or not start_date or not end_date:
        return jsonify({'error': 'Missing required fields'}), 400
    
    conn = get_db_connection()
    try:
        # Create trip
        cursor = conn.cursor()
        cursor.execute('INSERT INTO trips (user_id, name, start_date, end_date, budget) VALUES (?, ?, ?, ?, ?)',
                       (session['user_id'], name, start_date, end_date, budget))
        trip_id = cursor.lastrowid
        
        # Add members
        for member in members:
            cursor.execute('INSERT INTO trip_members (trip_id, name, email, phone) VALUES (?, ?, ?, ?)',
                           (trip_id, member['name'], member['email'], member['phone']))
        
        conn.commit()
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()
    
    return jsonify({'message': 'Trip created successfully', 'trip_id': trip_id})

@app.route('/api/trips/<int:trip_id>/expenses', methods=['POST'])
def add_trip_expense(trip_id):
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    data = request.get_json()
    description = data.get('description')
    amount = float(data.get('amount', 0))
    category = data.get('category', 'other')
    
    if not description or amount <= 0:
        return jsonify({'error': 'Invalid expense data'}), 400
    
    conn = get_db_connection()
    try:
        conn.execute('INSERT INTO trip_expenses (trip_id, user_id, date, description, amount, category) VALUES (?, ?, ?, ?, ?, ?)',
                     (trip_id, session['user_id'], datetime.now().date(), description, amount, category))
        conn.commit()
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()
    
    return jsonify({'message': 'Expense added successfully'})

if __name__ == '__main__':
    app.run(debug=True)