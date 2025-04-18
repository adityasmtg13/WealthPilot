document.addEventListener('DOMContentLoaded', function() {
    // Initialize all charts
    initDashboardCharts();
    initIncomeTaxCharts();
    initExpenseCharts();
    initEMICharts();
    initStockCharts();
    initTripCharts();
    
    // Navigation functionality
    setupNavigation();
    
    // Form submissions
    setupForms();
    
    // Other interactive elements
    setupInteractiveElements();
    
    // Add RGB animation to logo
    const logo = document.getElementById('wealthPilotLogo');
    logo.classList.add('rgb-border');
});

function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            navItems.forEach(navItem => navItem.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Hide all sections
            const sections = document.querySelectorAll('.content-section');
            sections.forEach(section => section.classList.remove('active'));
            
            // Show the selected section
            const sectionId = this.getAttribute('data-section');
            document.getElementById(sectionId).classList.add('active');
        });
    });
}

function setupForms() {
    // Income Tax Form
    const incomeForm = document.getElementById('incomeForm');
    if (incomeForm) {
        incomeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            calculateTaxes();
        });
    }
    
    // Expense Form
    const expenseForm = document.getElementById('expenseForm');
    if (expenseForm) {
        expenseForm.addEventListener('submit', function(e) {
            e.preventDefault();
            calculateBudget();
        });
    }
    
    // EMI Form
    const emiForm = document.getElementById('emiForm');
    if (emiForm) {
        emiForm.addEventListener('submit', function(e) {
            e.preventDefault();
            calculateEMI();
        });
    }
    
    // Extra Payment Calculator
    const calculateExtraBtn = document.getElementById('calculateExtra');
    if (calculateExtraBtn) {
        calculateExtraBtn.addEventListener('click', calculateEMIExtra);
    }
    
    // Trip Form
    const tripForm = document.getElementById('tripForm');
    if (tripForm) {
        tripForm.addEventListener('submit', function(e) {
            e.preventDefault();
            createTrip();
        });
    }
    
    // Add Member Button
    const addMemberBtn = document.getElementById('addMember');
    if (addMemberBtn) {
        addMemberBtn.addEventListener('click', addTripMember);
    }
}

function setupInteractiveElements() {
    // Tabs functionality
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabContentId = this.getAttribute('data-tab');
            const tabContainer = this.closest('.tabs-header').nextElementSibling;
            
            // Remove active class from all tabs
            this.closest('.tabs-header').querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Hide all tab contents
            tabContainer.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            // Show the selected tab content
            tabContainer.querySelector(`#${tabContentId}`).classList.add('active');
        });
    });
    
    // Remove member buttons
    document.querySelectorAll('.btn-remove-member').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.member-item').remove();
        });
    });
    
    // Refresh buttons
    document.querySelectorAll('.refresh-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.add('rotate');
            setTimeout(() => {
                this.classList.remove('rotate');
            }, 1000);
            // Here you would typically refresh data
        });
    });
}

function initDashboardCharts() {
    // Net Worth Chart
    const netWorthCtx = document.getElementById('netWorthChart').getContext('2d');
    const netWorthChart = new Chart(netWorthCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Net Worth',
                data: [200000, 210000, 215000, 225000, 230000, 245000],
                borderColor: '#00ffaa',
                backgroundColor: 'rgba(0, 255, 170, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
    
    // Asset Allocation Chart
    const assetAllocationCtx = document.getElementById('assetAllocationChart').getContext('2d');
    const assetAllocationChart = new Chart(assetAllocationCtx, {
        type: 'doughnut',
        data: {
            labels: ['Stocks', 'Bonds', 'Real Estate', 'Cash'],
            datasets: [{
                data: [45, 20, 25, 10],
                backgroundColor: [
                    '#4e79a7',
                    '#f28e2b',
                    '#e15759',
                    '#76b7b2'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function initIncomeTaxCharts() {
    // Tax Breakdown Chart
    const taxBreakdownCtx = document.getElementById('taxBreakdownChart').getContext('2d');
    const taxBreakdownChart = new Chart(taxBreakdownCtx, {
        type: 'bar',
        data: {
            labels: ['Federal', 'State', 'Social Security', 'Medicare'],
            datasets: [{
                label: 'Tax Amount',
                data: [18000, 7200, 7440, 1740],
                backgroundColor: [
                    'rgba(0, 255, 170, 0.7)',
                    'rgba(255, 0, 170, 0.7)',
                    'rgba(0, 170, 255, 0.7)',
                    'rgba(170, 0, 255, 0.7)'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function initExpenseCharts() {
    // Budget Chart
    const budgetCtx = document.getElementById('budgetChart').getContext('2d');
    const budgetChart = new Chart(budgetCtx, {
        type: 'doughnut',
        data: {
            labels: ['Housing', 'Utilities', 'Groceries', 'Transportation', 'Entertainment', 'Other', 'Savings'],
            datasets: [{
                data: [2350, 350, 600, 450, 300, 200, 1427],
                backgroundColor: [
                    '#4e79a7',
                    '#f28e2b',
                    '#59a14f',
                    '#e15759',
                    '#edc948',
                    '#76b7b2',
                    '#b07aa1'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function initEMICharts() {
    // EMI Breakdown Chart
    const emiBreakdownCtx = document.getElementById('emiBreakdownChart').getContext('2d');
    const emiBreakdownChart = new Chart(emiBreakdownCtx, {
        type: 'pie',
        data: {
            labels: ['Principal', 'Interest'],
            datasets: [{
                data: [250000, 154140],
                backgroundColor: [
                    'rgba(0, 255, 170, 0.7)',
                    'rgba(255, 0, 170, 0.7)'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
    
    // Loan Comparison Chart
    const loanComparisonCtx = document.getElementById('loanComparisonChart').getContext('2d');
    const loanComparisonChart = new Chart(loanComparisonCtx, {
        type: 'bar',
        data: {
            labels: ['15 years', '20 years', '30 years'],
            datasets: [
                {
                    label: 'Monthly Payment',
                    data: [1758.47, 1419.47, 1122.61],
                    backgroundColor: 'rgba(0, 255, 170, 0.7)',
                    borderWidth: 0
                },
                {
                    label: 'Total Interest',
                    data: [66524.60, 90672.80, 154140.60],
                    backgroundColor: 'rgba(255, 0, 170, 0.7)',
                    borderWidth: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function initStockCharts() {
    // Portfolio Allocation Chart
    const portfolioAllocationCtx = document.getElementById('portfolioAllocationChart').getContext('2d');
    const portfolioAllocationChart = new Chart(portfolioAllocationCtx, {
        type: 'doughnut',
        data: {
            labels: ['Tech', 'Healthcare', 'Finance', 'Consumer', 'Energy', 'Other'],
            datasets: [{
                data: [45, 15, 12, 10, 8, 10],
                backgroundColor: [
                    '#4e79a7',
                    '#59a14f',
                    '#f28e2b',
                    '#e15759',
                    '#edc948',
                    '#76b7b2'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
    
    // Performance Chart
    const performanceCtx = document.getElementById('performanceChart').getContext('2d');
    const performanceChart = new Chart(performanceCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Your Portfolio',
                    data: [100, 105, 102, 108, 110, 112],
                    borderColor: '#00ffaa',
                    backgroundColor: 'rgba(0, 255, 170, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'S&P 500',
                    data: [100, 103, 101, 104, 106, 107],
                    borderColor: '#ff00aa',
                    backgroundColor: 'rgba(255, 0, 170, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
    
    // Stock Detail Chart
    const stockDetailCtx = document.getElementById('stockDetailChart').getContext('2d');
    const stockDetailChart = new Chart(stockDetailCtx, {
        type: 'line',
        data: {
            labels: ['9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '1:00', '1:30', '2:00', '2:30', '3:00', '3:30', '4:00'],
            datasets: [{
                label: 'AAPL',
                data: [172.50, 173.20, 173.80, 174.50, 174.20, 174.80, 175.20, 175.50, 175.30, 175.60, 175.40, 175.30, 175.45, 175.43],
                borderColor: '#00ffaa',
                backgroundColor: 'rgba(0, 255, 170, 0.1)',
                borderWidth: 2,
                tension: 0.1,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toFixed(2);
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function initTripCharts() {
    // Trip Expenses Chart
    const tripExpensesCtx = document.getElementById('tripExpensesChart').getContext('2d');
    const tripExpensesChart = new Chart(tripExpensesCtx, {
        type: 'bar',
        data: {
            labels: ['Flights', 'Accommodation', 'Food', 'Transport', 'Activities', 'Shopping'],
            datasets: [{
                label: 'Expenses',
                data: [1200, 800, 500, 300, 250, 200],
                backgroundColor: 'rgba(0, 255, 170, 0.7)',
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + value;
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function calculateTaxes() {
    const grossSalary = parseFloat(document.getElementById('grossSalary').value);
    const state = document.getElementById('state').value;
    const filingStatus = document.getElementById('filingStatus').value;
    const payFrequency = document.getElementById('payFrequency').value;
    
    // Simplified tax calculation (in a real app, this would be more complex)
    let federalTax = grossSalary * 0.15;
    let stateTax = grossSalary * 0.06;
    let socialSecurity = grossSalary * 0.062;
    let medicare = grossSalary * 0.0145;
    
    // Adjust based on filing status
    if (filingStatus === 'married_joint') {
        federalTax = grossSalary * 0.12;
    } else if (filingStatus === 'head') {
        federalTax = grossSalary * 0.13;
    }
    
    // Adjust state tax based on selected state
    if (state === 'CA') {
        stateTax = grossSalary * 0.07;
    } else if (state === 'TX') {
        stateTax = 0; // Texas has no state income tax
    }
    
    const totalTax = federalTax + stateTax + socialSecurity + medicare;
    const netAnnualIncome = grossSalary - totalTax;
    
    // Calculate monthly take-home based on pay frequency
    let monthlyTakeHome;
    if (payFrequency === 'monthly') {
        monthlyTakeHome = netAnnualIncome / 12;
    } else if (payFrequency === 'biweekly') {
        monthlyTakeHome = (netAnnualIncome / 26) * 2;
    } else if (payFrequency === 'weekly') {
        monthlyTakeHome = (netAnnualIncome / 52) * 4;
    } else {
        monthlyTakeHome = netAnnualIncome / 12;
    }
    
    // Update the UI
    document.querySelector('.tax-summary-item:nth-child(1) .tax-value').textContent = '$' + grossSalary.toLocaleString('en-US', {maximumFractionDigits: 2});
    document.querySelector('.tax-summary-item:nth-child(2) .tax-value').textContent = '-$' + federalTax.toLocaleString('en-US', {maximumFractionDigits: 2});
    document.querySelector('.tax-summary-item:nth-child(3) .tax-value').textContent = '-$' + stateTax.toLocaleString('en-US', {maximumFractionDigits: 2});
    document.querySelector('.tax-summary-item:nth-child(4) .tax-value').textContent = '-$' + socialSecurity.toLocaleString('en-US', {maximumFractionDigits: 2});
    document.querySelector('.tax-summary-item:nth-child(5) .tax-value').textContent = '-$' + medicare.toLocaleString('en-US', {maximumFractionDigits: 2});
    document.querySelector('.tax-summary-item:nth-child(6) .tax-value').textContent = '$' + netAnnualIncome.toLocaleString('en-US', {maximumFractionDigits: 2});
    document.querySelector('.tax-summary-item:nth-child(7) .tax-value').textContent = '$' + monthlyTakeHome.toLocaleString('en-US', {maximumFractionDigits: 2});
    
    // Update the chart data
    const taxBreakdownChart = Chart.getChart('taxBreakdownChart');
    taxBreakdownChart.data.datasets[0].data = [federalTax, stateTax, socialSecurity, medicare];
    taxBreakdownChart.update();
}

function calculateBudget() {
    const monthlyIncome = parseFloat(document.getElementById('monthlyIncome').value);
    const savingsGoal = parseFloat(document.getElementById('savingsGoal').value);
    const rent = parseFloat(document.getElementById('rent').value);
    const utilities = parseFloat(document.getElementById('utilities').value);
    const groceries = parseFloat(document.getElementById('groceries').value);
    const transportation = parseFloat(document.getElementById('transportation').value);
    const entertainment = parseFloat(document.getElementById('entertainment').value);
    const other = parseFloat(document.getElementById('other').value);
    
    const savingsAmount = monthlyIncome * (savingsGoal / 100);
    const totalExpenses = rent + utilities + groceries + transportation + entertainment + other;
    const remainingBalance = monthlyIncome - totalExpenses - savingsAmount;
    
    // Update the UI
    document.querySelector('.budget-summary-item:nth-child(1) .budget-value').textContent = '$' + monthlyIncome.toLocaleString('en-US', {maximumFractionDigits: 2});
    document.querySelector('.budget-summary-item:nth-child(2) .budget-value').textContent = '-$' + totalExpenses.toLocaleString('en-US', {maximumFractionDigits: 2});
    document.querySelector('.budget-summary-item:nth-child(3) .budget-value').textContent = '$' + savingsAmount.toLocaleString('en-US', {maximumFractionDigits: 2});
    document.querySelector('.budget-summary-item:nth-child(4) .budget-value').textContent = '$' + remainingBalance.toLocaleString('en-US', {maximumFractionDigits: 2});
    
    // Update the chart data
    const budgetChart = Chart.getChart('budgetChart');
    budgetChart.data.datasets[0].data = [rent, utilities, groceries, transportation, entertainment, other, savingsAmount];
    budgetChart.update();
}

function calculateEMI() {
    const loanAmount = parseFloat(document.getElementById('loanAmount').value);
    const interestRate = parseFloat(document.getElementById('interestRate').value);
    const loanTerm = parseInt(document.getElementById('loanTerm').value);
    const startDate = document.getElementById('startDate').value;
    
    // Calculate EMI
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    const emi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    const totalPayment = emi * numberOfPayments;
    const totalInterest = totalPayment - loanAmount;
    
    // Calculate payoff date
    const startDateObj = new Date(startDate);
    const payoffDate = new Date(startDateObj);
    payoffDate.setFullYear(startDateObj.getFullYear() + loanTerm);
    
    // Update the UI
    document.querySelector('.emi-summary-item:nth-child(1) .emi-value').textContent = '$' + emi.toLocaleString('en-US', {maximumFractionDigits: 2});
    document.querySelector('.emi-summary-item:nth-child(2) .emi-value').textContent = '$' + totalInterest.toLocaleString('en-US', {maximumFractionDigits: 2});
    document.querySelector('.emi-summary-item:nth-child(3) .emi-value').textContent = '$' + totalPayment.toLocaleString('en-US', {maximumFractionDigits: 2});
    document.querySelector('.emi-summary-item:nth-child(4) .emi-value').textContent = payoffDate.toLocaleString('default', {month: 'long', year: 'numeric'});
    
    // Update the chart data
    const emiBreakdownChart = Chart.getChart('emiBreakdownChart');
    emiBreakdownChart.data.datasets[0].data = [loanAmount, totalInterest];
    emiBreakdownChart.update();
}

function calculateEMIExtra() {
    const extraPayment = parseFloat(document.getElementById('extraPayment').value);
    const loanAmount = parseFloat(document.getElementById('loanAmount').value);
    const interestRate = parseFloat(document.getElementById('interestRate').value);
    const loanTerm = parseInt(document.getElementById('loanTerm').value);
    
    // Simplified calculation for extra payments
    const monthlyRate = interestRate / 100 / 12;
    const originalEmi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTerm * 12) / (Math.pow(1 + monthlyRate, loanTerm * 12) - 1);
    const newEmi = originalEmi + extraPayment;
    
    // Estimate savings (this would be more complex in reality)
    const interestSaved = loanAmount * (interestRate / 100) * (loanTerm / 2) * 0.7;
    const yearsSaved = loanTerm * 0.3;
    
    // Update the UI
    document.querySelector('.extra-payment-results p').textContent = 
        `Paying an extra $${extraPayment.toFixed(2)}/month would save you $${interestSaved.toLocaleString('en-US', {maximumFractionDigits: 2}) in interest and pay off your loan ${yearsSaved.toFixed(1)} years earlier.`;
}

function createTrip() {
    const tripName = document.getElementById('tripName').value;
    const tripStartDate = document.getElementById('tripStartDate').value;
    const tripEndDate = document.getElementById('tripEndDate').value;
    const tripBudget = parseFloat(document.getElementById('tripBudget').value);
    
    // In a real app, you would save this to a database
    alert(`Trip "${tripName}" created successfully!`);
    
    // Reset the form
    document.getElementById('tripForm').reset();
    document.querySelector('.trip-members-list').innerHTML = '';
}

function addTripMember() {
    const memberName = document.getElementById('memberName').value;
    const memberEmail = document.getElementById('memberEmail').value;
    const memberPhone = document.getElementById('memberPhone').value;
    
    if (!memberName || !memberEmail || !memberPhone) {
        alert('Please fill in all member details');
        return;
    }
    
    const memberItem = document.createElement('div');
    memberItem.className = 'member-item';
    memberItem.innerHTML = `
        <div class="member-info">
            <span class="member-name">${memberName}</span>
            <span class="member-email">${memberEmail}</span>
            <span class="member-phone">${memberPhone}</span>
        </div>
        <button class="btn-remove-member"><i class="fas fa-times"></i></button>
    `;
    
    document.querySelector('.trip-members-list').appendChild(memberItem);
    
    // Add event listener to the new remove button
    memberItem.querySelector('.btn-remove-member').addEventListener('click', function() {
        this.closest('.member-item').remove();
    });
    
    // Clear the input fields
    document.getElementById('memberName').value = '';
    document.getElementById('memberEmail').value = '';
    document.getElementById('memberPhone').value = '';
}

// Initialize theme toggle
const themeToggle = document.querySelector('.theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('light-theme');
        
        if (document.body.classList.contains('light-theme')) {
            this.innerHTML = '<i class="fas fa-moon"></i><span>Dark Theme</span>';
            // Update CSS variables for light theme
            document.documentElement.style.setProperty('--primary-bg', '#f5f5f5');
            document.documentElement.style.setProperty('--secondary-bg', '#ffffff');
            document.documentElement.style.setProperty('--card-bg', '#ffffff');
            document.documentElement.style.setProperty('--text-primary', '#333333');
            document.documentElement.style.setProperty('--text-secondary', '#666666');
            document.documentElement.style.setProperty('--border-color', '#e0e0e0');
            document.documentElement.style.setProperty('--highlight', 'rgba(0, 200, 150, 0.1)');
            document.documentElement.style.setProperty('--shadow', '0 4px 20px rgba(0, 0, 0, 0.1)');
        } else {
            this.innerHTML = '<i class="fas fa-sun"></i><span>Light Theme</span>';
            // Reset to dark theme variables
            document.documentElement.style.setProperty('--primary-bg', '#121212');
            document.documentElement.style.setProperty('--secondary-bg', '#1e1e1e');
            document.documentElement.style.setProperty('--card-bg', '#252525');
            document.documentElement.style.setProperty('--text-primary', '#ffffff');
            document.documentElement.style.setProperty('--text-secondary', '#b3b3b3');
            document.documentElement.style.setProperty('--border-color', '#333333');
            document.documentElement.style.setProperty('--highlight', 'rgba(0, 255, 170, 0.1)');
            document.documentElement.style.setProperty('--shadow', '0 4px 20px rgba(0, 0, 0, 0.3)');
        }
    });
}

// Initialize logout button
const logoutBtn = document.querySelector('.logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
        // In a real app, this would log the user out
        alert('You have been logged out');
        window.location.href = 'login.html'; // Redirect to login page
    });
}
