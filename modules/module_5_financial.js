/**
 * ============================================
 * MODULE 5: FINANCIAL TOOLS & CALCULATORS
 * ============================================
 * Purpose: Provide financial calculations and budget planning tools
 * Functions: calculateBudget(), calculateDetailedBudget(), calculateSavings(),
 *            calculateCollege(), handleEmergencyFund()
 * Dependencies: Chart.js (external library)
 */

// Financial State
const financialState = {
    budgets: {},
    savings: 0,
    emergencyFund: 0,
    expenses: {}
};

// Calculate Budget
function calculateBudget() {
    const income = parseFloat(document.getElementById('monthlyIncome')?.value || 0);
    const expenses = parseFloat(document.getElementById('totalExpenses')?.value || 0);

    if (!income || income <= 0) {
        alert('Please enter a valid income amount');
        return;
    }

    const remaining = income - expenses;
    const resultElement = document.getElementById('budgetResult');

    if (resultElement) {
        resultElement.innerHTML = `
            <div class="budget-summary">
                <h3>Monthly Budget Summary</h3>
                <p>Monthly Income: $${income.toFixed(2)}</p>
                <p>Total Expenses: $${expenses.toFixed(2)}</p>
                <p><strong>Remaining: $${remaining.toFixed(2)}</strong></p>
                <p class="percentage">${((expenses/income)*100).toFixed(1)}% of income spent</p>
            </div>
        `;
    }

    financialState.budgets['monthly'] = {
        income: income,
        expenses: expenses,
        remaining: remaining
    };

    createBudgetChart(income, expenses);
}

// Calculate Detailed Budget
function calculateDetailedBudget() {
    const categories = ['housing', 'food', 'transportation', 'utilities', 'entertainment', 'other'];
    let totalExpenses = 0;
    const categoryData = {};

    categories.forEach(category => {
        const value = parseFloat(document.getElementById(`expense_${category}`)?.value || 0);
        categoryData[category] = value;
        totalExpenses += value;
    });

    const income = parseFloat(document.getElementById('detailedIncome')?.value || 0);

    const resultElement = document.getElementById('detailedBudgetResult');
    if (resultElement) {
        let html = '<div class="detailed-budget"><h3>Detailed Budget Breakdown</h3>';
        html += `<p>Total Income: $${income.toFixed(2)}</p>`;

        categories.forEach(category => {
            const amount = categoryData[category];
            const percentage = ((amount / income) * 100).toFixed(1);
            html += `<p>${category.charAt(0).toUpperCase() + category.slice(1)}: $${amount.toFixed(2)} (${percentage}%)</p>`;
        });

        html += `<p><strong>Remaining: $${(income - totalExpenses).toFixed(2)}</strong></p></div>`;
        resultElement.innerHTML = html;
    }

    createDetailedBudgetChart(categoryData);
}

// Calculate Savings
function calculateSavings() {
    const income = parseFloat(document.getElementById('savingsIncome')?.value || 0);
    const savingsPercent = parseFloat(document.getElementById('savingsPercentage')?.value || 20);

    if (!income || income <= 0) {
        alert('Please enter valid income');
        return;
    }

    const monthlySavings = (income * savingsPercent) / 100;
    const yearlySavings = monthlySavings * 12;

    financialState.savings = yearlySavings;

    const resultElement = document.getElementById('savingsResult');
    if (resultElement) {
        resultElement.innerHTML = `
            <div class="savings-summary">
                <h3>Savings Plan</h3>
                <p>Monthly Savings ({${savingsPercent}%): $${monthlySavings.toFixed(2)}</p>
                <p><strong>Yearly Savings: $${yearlySavings.toFixed(2)}</strong></p>
            </div>
        `;
    }
}

// Calculate College Costs
function calculateCollege() {
    const yearsRemaining = parseFloat(document.getElementById('yearsToCollege')?.value || 4);
    const estimatedCost = parseFloat(document.getElementById('estimatedCollegeCost')?.value || 50000);
    const currentSavings = parseFloat(document.getElementById('currentCollegeSavings')?.value || 0);

    const totalNeeded = estimatedCost * yearsRemaining;
    const needed = Math.max(totalNeeded - currentSavings, 0);
    const monthlyRequired = needed / (yearsRemaining * 12);

    const resultElement = document.getElementById('collegeResult');
    if (resultElement) {
        resultElement.innerHTML = `
            <div class="college-calc">
                <h3>College Cost Calculation</h3>
                <p>Estimated Total Cost: $${totalNeeded.toFixed(2)}</p>
                <p>Current Savings: $${currentSavings.toFixed(2)}</p>
                <p>Amount Needed: $${needed.toFixed(2)}</p>
                <p><strong>Monthly Target: $${monthlyRequired.toFixed(2)}</strong></p>
            </div>
        `;
    }
}

// Handle Emergency Fund
function handleEmergencyFund() {
    const amount = parseFloat(document.getElementById('emergencyAmount')?.value || 0);
    const action = document.getElementById('emergencyAction')?.value || 'add';

    if (action === 'add') {
        financialState.emergencyFund += amount;
    } else if (action === 'withdraw') {
        financialState.emergencyFund = Math.max(financialState.emergencyFund - amount, 0);
    }

    const resultElement = document.getElementById('emergencyFundResult');
    if (resultElement) {
        resultElement.innerHTML = `
            <div class="emergency-status">
                <h3>Emergency Fund Status</h3>
                <p><strong>Current Balance: $${financialState.emergencyFund.toFixed(2)}</strong></p>
                <p>Recommended 3-6 months expenses: $${(financialState.emergencyFund * 0.5).toFixed(2)} - $${(financialState.emergencyFund).toFixed(2)}</p>
            </div>
        `;
    }
}

// Helper: Create Budget Chart
function createBudgetChart(income, expenses) {
    const ctx = document.getElementById('budgetChart')?.getContext('2d');
    if (!ctx) return;

    const remaining = income - expenses;
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Expenses', 'Remaining'],
            datasets: [{
                data: [expenses, remaining],
                backgroundColor: [
                    'rgb(255, 0, 110)',
                    'rgb(57, 255, 20)'
                ]
            }]
        }
    });
}

// Helper: Create Detailed Budget Chart
function createDetailedBudgetChart(categoryData) {
    const ctx = document.getElementById('detailedBudgetChart')?.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(categoryData),
            datasets: [{
                data: Object.values(categoryData),
                backgroundColor: [
                    'rgb(0, 217, 255)',
                    'rgb(255, 0, 110)',
                    'rgb(191, 0, 255)',
                    'rgb(57, 255, 20)',
                    'rgb(255, 215, 0)',
                    'rgb(100, 200, 255)'
                ]
            }]
        }
    });
}

// Export functions
window.FinancialModule = {
    calculateBudget: calculateBudget,
    calculateDetailedBudget: calculateDetailedBudget,
    calculateSavings: calculateSavings,
    calculateCollege: calculateCollege,
    handleEmergencyFund: handleEmergencyFund,
    getFinancialState: () => financialState
};
