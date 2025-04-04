// Initialize with empty data
const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    income: [0, 0, 0, 0, 0, 0],
    expenses: [0, 0, 0, 0, 0, 0]
};

const categoryData = {
    labels: ['Food', 'Shopping', 'Transport', 'Entertainment', 'Bills'],
    data: [0, 0, 0, 0, 0]
};

// Load data from localStorage
function loadData() {
    const savedTransactions = localStorage.getItem('transactions');
    const savedSummary = localStorage.getItem('summary');
    
    if (savedTransactions) {
        const transactions = JSON.parse(savedTransactions);
        transactions.forEach(transaction => {
            addTransaction(transaction);
        });
    }
    
    if (savedSummary) {
        const summary = JSON.parse(savedSummary);
        updateSummaryCards(summary);
    }
}

// Save data to localStorage
function saveData() {
    const transactions = [];
    document.querySelectorAll('.transaction').forEach(transactionElement => {
        const transaction = {
            type: transactionElement.querySelector('.transaction-amount').classList.contains('positive') ? 'income' : 'expense',
            amount: parseFloat(transactionElement.querySelector('.transaction-amount').textContent.replace(/[^0-9.-]+/g, '')),
            category: transactionElement.querySelector('.transaction-details h4').textContent,
            description: transactionElement.querySelector('.transaction-details p').textContent,
            date: new Date().toISOString()
        };
        transactions.push(transaction);
    });
    
    const summary = {
        income: parseFloat(document.querySelector('.card:nth-child(1) .amount').textContent.replace(/[^0-9.-]+/g, '')),
        expenses: parseFloat(document.querySelector('.card:nth-child(2) .amount').textContent.replace(/[^0-9.-]+/g, '')),
        balance: parseFloat(document.querySelector('.card:nth-child(3) .amount').textContent.replace(/[^0-9.-]+/g, ''))
    };
    
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('summary', JSON.stringify(summary));
}

// Initialize charts
document.addEventListener('DOMContentLoaded', () => {
    // Monthly Overview Chart
    const monthlyCtx = document.getElementById('monthlyChart').getContext('2d');
    new Chart(monthlyCtx, {
        type: 'line',
        data: {
            labels: monthlyData.labels,
            datasets: [
                {
                    label: 'Income',
                    data: monthlyData.income,
                    borderColor: '#2ecc71',
                    backgroundColor: 'rgba(46, 204, 113, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Expenses',
                    data: monthlyData.expenses,
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    });

    // Category Chart
    const categoryCtx = document.getElementById('categoryChart').getContext('2d');
    new Chart(categoryCtx, {
        type: 'doughnut',
        data: {
            labels: categoryData.labels,
            datasets: [{
                data: categoryData.data,
                backgroundColor: [
                    '#2ecc71',
                    '#3498db',
                    '#9b59b6',
                    '#f1c40f',
                    '#e74c3c'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right'
                }
            },
            cutout: '70%'
        }
    });

    // Initialize summary cards with zero values
    updateSummaryCards({
        income: 0,
        expenses: 0,
        balance: 0
    });

    // Clear transactions list
    const transactionsList = document.querySelector('.transactions-list');
    transactionsList.innerHTML = '';

    // Load saved data
    loadData();

    // Add event listeners
    setupEventListeners();
    setupTransactionForm();
    setupTransactionActions();

    // Add clear all button event listener
    const clearAllBtn = document.querySelector('.clear-all-btn');
    clearAllBtn.addEventListener('click', clearAllTransactions);
});

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filterTransactions(searchTerm);
    });

    // Notification click
    const notificationBell = document.querySelector('.notifications');
    notificationBell.addEventListener('click', () => {
        // Implement notification dropdown or modal
        alert('Notifications feature coming soon!');
    });
}

// Filter transactions based on search term
function filterTransactions(searchTerm) {
    const transactions = document.querySelectorAll('.transaction');
    transactions.forEach(transaction => {
        const text = transaction.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            transaction.style.display = 'flex';
        } else {
            transaction.style.display = 'none';
        }
    });
}

// Update dashboard data
function updateDashboardData() {
    // This function would be called when new data is available
    // For now, it's just a placeholder
    console.log('Updating dashboard data...');
}

// Sample function to add a new transaction
function addTransaction(transaction) {
    const transactionsList = document.querySelector('.transactions-list');
    const transactionElement = document.createElement('div');
    transactionElement.className = 'transaction';
    
    // Determine if it's income or expense based on the amount
    const isIncome = transaction.amount > 0;
    
    transactionElement.innerHTML = `
        <div class="transaction-icon">
            <i class="fas ${getCategoryIcon(transaction.category)}"></i>
        </div>
        <div class="transaction-details">
            <h4>${transaction.category}</h4>
            <p>${transaction.description}</p>
        </div>
        <div class="transaction-amount ${isIncome ? 'positive' : 'negative'}">
            ${isIncome ? '+' : ''}₹${Math.abs(transaction.amount).toLocaleString()}
        </div>
        <div class="transaction-actions">
            <button class="edit-btn" title="Edit Transaction">
                <i class="fas fa-edit"></i>
            </button>
            <button class="delete-btn" title="Delete Transaction">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    transactionsList.insertBefore(transactionElement, transactionsList.firstChild);
}

// Sample function to update summary cards
function updateSummaryCards(data) {
    const incomeCard = document.querySelector('.card:nth-child(1) .amount');
    const expenseCard = document.querySelector('.card:nth-child(2) .amount');
    const balanceCard = document.querySelector('.card:nth-child(3) .amount');

    incomeCard.textContent = `₹${data.income}`;
    expenseCard.textContent = `₹${data.expenses}`;
    balanceCard.textContent = `₹${data.balance}`;
}

// Setup transaction form
function setupTransactionForm() {
    const form = document.getElementById('transactionForm');
    form.addEventListener('submit', handleTransactionSubmit);
}

// Handle transaction form submission
function handleTransactionSubmit(e) {
    e.preventDefault();
    
    const type = document.getElementById('transactionType').value;
    const amount = parseFloat(document.getElementById('transactionAmount').value);
    const category = document.getElementById('transactionCategory').value;
    const description = document.getElementById('transactionDescription').value;
    
    // Create transaction object
    const transaction = {
        type,
        amount: type === 'expense' ? -Math.abs(amount) : Math.abs(amount),
        category,
        description,
        date: new Date().toISOString()
    };
    
    // Add transaction to the list
    addTransaction(transaction);
    
    // Update summary cards and balance
    updateSummaryCardsFromTransaction(transaction);
    
    // Save data to localStorage
    saveData();
    
    // Reset form
    e.target.reset();
    
    // Show success message
    showNotification('Transaction added successfully!');
}

// Get icon based on category
function getCategoryIcon(category) {
    const icons = {
        salary: 'money-bill-wave',
        shopping: 'shopping-bag',
        food: 'utensils',
        transport: 'car',
        entertainment: 'film',
        bills: 'file-invoice',
        other: 'ellipsis-h'
    };
    return icons[category] || 'ellipsis-h';
}

// Update summary cards based on new transaction
function updateSummaryCardsFromTransaction(transaction) {
    const incomeCard = document.querySelector('.card:nth-child(1) .amount');
    const expenseCard = document.querySelector('.card:nth-child(2) .amount');
    const balanceCard = document.querySelector('.card:nth-child(3) .amount');
    
    // Get current values
    let currentIncome = parseFloat(incomeCard.textContent.replace(/[^0-9.-]+/g, ''));
    let currentExpenses = parseFloat(expenseCard.textContent.replace(/[^0-9.-]+/g, ''));
    let currentBalance = parseFloat(balanceCard.textContent.replace(/[^0-9.-]+/g, ''));
    
    // Update based on transaction type
    if (transaction.type === 'income') {
        currentIncome += Math.abs(transaction.amount);
        currentBalance += Math.abs(transaction.amount);
    } else {
        currentExpenses += Math.abs(transaction.amount);
        currentBalance -= Math.abs(transaction.amount);
    }
    
    // Update the cards
    incomeCard.textContent = `₹${currentIncome.toLocaleString()}`;
    expenseCard.textContent = `₹${currentExpenses.toLocaleString()}`;
    balanceCard.textContent = `₹${currentBalance.toLocaleString()}`;
    
    // Update trends
    updateTrends(currentIncome, currentExpenses);
}

// Update trend indicators
function updateTrends(income, expense) {
    const incomeTrend = document.querySelector('.card:nth-child(1) .trend');
    const expenseTrend = document.querySelector('.card:nth-child(2) .trend');
    const balanceTrend = document.querySelector('.card:nth-child(3) .trend');
    
    // Reset trends to empty
    incomeTrend.textContent = '';
    expenseTrend.textContent = '';
    balanceTrend.textContent = '';
    
    incomeTrend.className = 'trend';
    expenseTrend.className = 'trend';
    balanceTrend.className = 'trend';
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add this after the existing transaction handling code
function setupTransactionActions() {
    const transactions = document.querySelectorAll('.transaction');
    
    transactions.forEach(transaction => {
        const editBtn = transaction.querySelector('.edit-btn');
        const deleteBtn = transaction.querySelector('.delete-btn');
        
        editBtn.addEventListener('click', () => {
            const transactionData = {
                type: transaction.querySelector('.transaction-amount').classList.contains('positive') ? 'income' : 'expense',
                amount: parseFloat(transaction.querySelector('.transaction-amount').textContent.replace(/[^0-9.-]+/g, '')),
                category: transaction.querySelector('.transaction-details h4').textContent,
                description: transaction.querySelector('.transaction-details p').textContent
            };
            
            showEditForm(transaction, transactionData);
        });
        
        deleteBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this transaction?')) {
                const amount = parseFloat(transaction.querySelector('.transaction-amount').textContent.replace(/[^0-9.-]+/g, ''));
                const isIncome = transaction.querySelector('.transaction-amount').classList.contains('positive');
                
                // Update summary cards
                if (isIncome) {
                    // Subtract from total income
                    const incomeCard = document.querySelector('.card:nth-child(1) .amount');
                    const currentIncome = parseFloat(incomeCard.textContent.replace(/[^0-9.-]+/g, ''));
                    incomeCard.textContent = `₹${(currentIncome - amount).toLocaleString()}`;
                } else {
                    // Subtract from total expenses
                    const expenseCard = document.querySelector('.card:nth-child(2) .amount');
                    const currentExpenses = parseFloat(expenseCard.textContent.replace(/[^0-9.-]+/g, ''));
                    expenseCard.textContent = `₹${(currentExpenses - amount).toLocaleString()}`;
                }
                
                // Update balance
                const balanceCard = document.querySelector('.card:nth-child(3) .amount');
                const currentBalance = parseFloat(balanceCard.textContent.replace(/[^0-9.-]+/g, ''));
                const newBalance = isIncome ? currentBalance - amount : currentBalance + amount;
                balanceCard.textContent = `₹${newBalance.toLocaleString()}`;
                
                // Remove transaction
                transaction.remove();
                
                // Save updated data to localStorage
                saveData();
                
                showNotification('Transaction deleted successfully');
            }
        });
    });
}

function showEditForm(transaction, data) {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    
    // Create form
    const form = document.createElement('div');
    form.className = 'edit-transaction-form';
    form.innerHTML = `
        <h3>Edit Transaction</h3>
        <div class="edit-form-group">
            <label for="edit-type">Type</label>
            <select id="edit-type">
                <option value="income" ${data.type === 'income' ? 'selected' : ''}>Income</option>
                <option value="expense" ${data.type === 'expense' ? 'selected' : ''}>Expense</option>
            </select>
        </div>
        <div class="edit-form-group">
            <label for="edit-amount">Amount</label>
            <input type="number" id="edit-amount" value="${data.amount}" step="0.01">
        </div>
        <div class="edit-form-group">
            <label for="edit-category">Category</label>
            <select id="edit-category">
                <option value="Salary" ${data.category === 'Salary' ? 'selected' : ''}>Salary</option>
                <option value="Shopping" ${data.category === 'Shopping' ? 'selected' : ''}>Shopping</option>
                <option value="Dining" ${data.category === 'Dining' ? 'selected' : ''}>Dining</option>
                <option value="Transport" ${data.category === 'Transport' ? 'selected' : ''}>Transport</option>
                <option value="Entertainment" ${data.category === 'Entertainment' ? 'selected' : ''}>Entertainment</option>
            </select>
        </div>
        <div class="edit-form-group">
            <label for="edit-description">Description</label>
            <input type="text" id="edit-description" value="${data.description}">
        </div>
        <div class="edit-form-actions">
            <button class="cancel-btn">Cancel</button>
            <button class="save-btn">Save</button>
        </div>
    `;
    
    // Add form and overlay to body
    document.body.appendChild(overlay);
    document.body.appendChild(form);
    
    // Handle form submission
    const saveBtn = form.querySelector('.save-btn');
    const cancelBtn = form.querySelector('.cancel-btn');
    
    saveBtn.addEventListener('click', () => {
        const newData = {
            type: form.querySelector('#edit-type').value,
            amount: parseFloat(form.querySelector('#edit-amount').value),
            category: form.querySelector('#edit-category').value,
            description: form.querySelector('#edit-description').value
        };
        
        // Update transaction
        updateTransaction(transaction, newData);
        
        // Remove form and overlay
        form.remove();
        overlay.remove();
        
        showNotification('Transaction updated successfully');
    });
    
    cancelBtn.addEventListener('click', () => {
        form.remove();
        overlay.remove();
    });
    
    // Close on overlay click
    overlay.addEventListener('click', () => {
        form.remove();
        overlay.remove();
    });
}

function updateTransaction(transaction, newData) {
    const oldAmount = parseFloat(transaction.querySelector('.transaction-amount').textContent.replace(/[^0-9.-]+/g, ''));
    const wasIncome = transaction.querySelector('.transaction-amount').classList.contains('positive');
    
    // Update transaction display
    transaction.querySelector('.transaction-details h4').textContent = newData.category;
    transaction.querySelector('.transaction-details p').textContent = newData.description;
    
    const amountElement = transaction.querySelector('.transaction-amount');
    amountElement.textContent = `${newData.type === 'income' ? '+' : '-'}₹${Math.abs(newData.amount).toLocaleString()}`;
    amountElement.className = `transaction-amount ${newData.type === 'income' ? 'positive' : 'negative'}`;
    
    // Update icon
    const iconElement = transaction.querySelector('.transaction-icon i');
    iconElement.className = `fas ${getCategoryIcon(newData.category)}`;
    
    // Update summary cards
    if (wasIncome) {
        updateIncome(-oldAmount);
    } else {
        updateExpenses(-oldAmount);
    }
    
    if (newData.type === 'income') {
        updateIncome(newData.amount);
    } else {
        updateExpenses(newData.amount);
    }
    
    updateBalance();
    
    // Save updated data to localStorage
    saveData();
}

// Add helper functions for updating individual values
function updateIncome(amount) {
    const incomeCard = document.querySelector('.card:nth-child(1) .amount');
    const currentIncome = parseFloat(incomeCard.textContent.replace(/[^0-9.-]+/g, ''));
    incomeCard.textContent = `₹${(currentIncome + amount).toLocaleString()}`;
}

function updateExpenses(amount) {
    const expenseCard = document.querySelector('.card:nth-child(2) .amount');
    const currentExpenses = parseFloat(expenseCard.textContent.replace(/[^0-9.-]+/g, ''));
    expenseCard.textContent = `₹${(currentExpenses + amount).toLocaleString()}`;
}

function updateBalance() {
    const incomeCard = document.querySelector('.card:nth-child(1) .amount');
    const expenseCard = document.querySelector('.card:nth-child(2) .amount');
    const balanceCard = document.querySelector('.card:nth-child(3) .amount');
    
    const currentIncome = parseFloat(incomeCard.textContent.replace(/[^0-9.-]+/g, ''));
    const currentExpenses = parseFloat(expenseCard.textContent.replace(/[^0-9.-]+/g, ''));
    const currentBalance = currentIncome - currentExpenses;
    
    balanceCard.textContent = `₹${currentBalance.toLocaleString()}`;
}

// Add this function after the existing transaction handling code
function clearAllTransactions() {
    if (confirm('Are you sure you want to clear all transactions? This action cannot be undone.')) {
        // Clear the transactions list
        const transactionsList = document.querySelector('.transactions-list');
        transactionsList.innerHTML = '';
        
        // Reset summary cards
        const incomeCard = document.querySelector('.card:nth-child(1) .amount');
        const expenseCard = document.querySelector('.card:nth-child(2) .amount');
        const balanceCard = document.querySelector('.card:nth-child(3) .amount');
        
        incomeCard.textContent = '₹0';
        expenseCard.textContent = '₹0';
        balanceCard.textContent = '₹0';
        
        // Reset trends
        updateTrends(0, 0);
        
        // Clear localStorage
        localStorage.removeItem('transactions');
        localStorage.removeItem('summary');
        
        showNotification('All transactions cleared successfully');
    }
} 