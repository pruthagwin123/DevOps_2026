const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

// Enable CORS for communication with the frontend
app.use(cors());
app.use(express.json());

// Mock Database - Sample Transactions
let transactions = [
  { id: 1, type: 'income', category: 'Salary', amount: 5000, description: 'Monthly Salary', date: '2026-02-01', recurring: true },
  { id: 2, type: 'expense', category: 'Food', amount: 500, description: 'Groceries', date: '2026-02-03', recurring: false },
  { id: 3, type: 'expense', category: 'Transport', amount: 200, description: 'Fuel', date: '2026-02-04', recurring: true },
  { id: 4, type: 'expense', category: 'Entertainment', amount: 150, description: 'Movie tickets', date: '2026-02-05', recurring: false },
  { id: 5, type: 'expense', category: 'Utilities', amount: 300, description: 'Electricity Bill', date: '2026-02-06', recurring: true },
  { id: 6, type: 'income', category: 'Bonus', amount: 2000, description: 'Performance Bonus', date: '2026-02-02', recurring: false },
  { id: 7, type: 'expense', category: 'Food', amount: 80, description: 'Lunch', date: '2026-02-07', recurring: false },
  { id: 8, type: 'expense', category: 'Healthcare', amount: 120, description: 'Doctor visit', date: '2026-02-08', recurring: false },
  { id: 9, type: 'expense', category: 'Shopping', amount: 450, description: 'Clothes', date: '2026-02-09', recurring: false },
];

let users = [
  { id: 1, username: 'student', password: '123456', name: 'Finance Student' }
];

// Helper function to calculate totals
const calculateTotals = (txns = transactions) => {
  const totalIncome = txns.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = txns.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  return { totalIncome, totalExpenses, balance: totalIncome - totalExpenses };
};

// Helper function to get category breakdown
const getCategoryBreakdown = (txns = transactions) => {
  const expenses = txns.filter(t => t.type === 'expense');
  const breakdown = {};
  expenses.forEach(t => {
    breakdown[t.category] = (breakdown[t.category] || 0) + t.amount;
  });
  return breakdown;
};

// API endpoint to fetch dashboard data
app.get('/api/dashboard', (req, res) => {
  const totals = calculateTotals();
  res.json({
    totalIncome: totals.totalIncome,
    totalExpenses: totals.totalExpenses,
    balance: totals.balance,
    budget: 4000
  });
});

// Get all transactions
app.get('/api/transactions', (req, res) => {
  const { startDate, endDate, category, type, search } = req.query;
  let filtered = [...transactions];

  // Filter by date range
  if (startDate) {
    filtered = filtered.filter(t => new Date(t.date) >= new Date(startDate));
  }
  if (endDate) {
    filtered = filtered.filter(t => new Date(t.date) <= new Date(endDate));
  }

  // Filter by category
  if (category) {
    filtered = filtered.filter(t => t.category === category);
  }

  // Filter by type
  if (type) {
    filtered = filtered.filter(t => t.type === type);
  }

  // Search by description
  if (search) {
    filtered = filtered.filter(t => t.description.toLowerCase().includes(search.toLowerCase()));
  }

  res.json(filtered.sort((a, b) => new Date(b.date) - new Date(a.date)));
});

// Get category breakdown
app.get('/api/categories', (req, res) => {
  const breakdown = getCategoryBreakdown();
  res.json(breakdown);
});

// Add new transaction
app.post('/api/transactions', (req, res) => {
  const { type, category, amount, description, date, recurring } = req.body;

  // Validation
  if (!type || !category || !amount || !description || !date) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const newTransaction = {
    id: Math.max(...transactions.map(t => t.id), 0) + 1,
    type,
    category,
    amount: parseFloat(amount),
    description,
    date,
    recurring: recurring || false
  };

  transactions.push(newTransaction);
  res.status(201).json(newTransaction);
});

// Delete transaction
app.delete('/api/transactions/:id', (req, res) => {
  const { id } = req.params;
  transactions = transactions.filter(t => t.id !== parseInt(id));
  res.json({ message: 'Transaction deleted' });
});

// Update transaction
app.put('/api/transactions/:id', (req, res) => {
  const { id } = req.params;
  const index = transactions.findIndex(t => t.id === parseInt(id));
  
  if (index === -1) {
    return res.status(404).json({ message: 'Transaction not found' });
  }

  transactions[index] = { ...transactions[index], ...req.body };
  res.json(transactions[index]);
});

// Get monthly trends
app.get('/api/trends', (req, res) => {
  const monthlyData = {};
  transactions.forEach(t => {
    const month = new Date(t.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    if (!monthlyData[month]) {
      monthlyData[month] = { income: 0, expense: 0 };
    }
    if (t.type === 'income') {
      monthlyData[month].income += t.amount;
    } else {
      monthlyData[month].expense += t.amount;
    }
  });
  res.json(monthlyData);
});

// Get recurring transactions
app.get('/api/recurring', (req, res) => {
  const recurring = transactions.filter(t => t.recurring);
  res.json(recurring);
});

// User Login (simple)
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  res.json({
    id: user.id,
    username: user.username,
    name: user.name,
    token: 'mock-jwt-token-' + user.id
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
  console.log(`Available endpoints:`);
  console.log(`  GET  /api/dashboard - Get summary totals`);
  console.log(`  GET  /api/transactions - Get all transactions`);
  console.log(`  POST /api/transactions - Add new transaction`);
  console.log(`  GET  /api/categories - Get expense categories breakdown`);
  console.log(`  GET  /api/trends - Get monthly trends`);
  console.log(`  GET  /api/recurring - Get recurring transactions`);
});