const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// In-memory data (simple DB for assignment)
let expenses = [
  { id: 1, title: "Groceries", amount: 500 },
  { id: 2, title: "Fuel", amount: 300 },
];

let income = [
  { id: 1, source: "Salary", amount: 10000 },
  { id: 2, source: "Freelance", amount: 2000 },
];

// Utility: compute dashboard summary
function getDashboardSummary() {
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const totalIncome = income.reduce((sum, i) => sum + Number(i.amount), 0);
  return {
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
  };
}

// API 1: Dashboard Summary
app.get("/api/dashboard", (req, res) => {
  res.json(getDashboardSummary());
});

// API 2: Get all expenses
app.get("/api/expenses", (req, res) => {
  res.json(expenses);
});

// API 3: Add new expense
app.post("/api/expenses", (req, res) => {
  const { title, amount } = req.body;
  if (!title || !amount) {
    return res.status(400).json({ error: "Title and amount required" });
  }
  const newExpense = {
    id: expenses.length > 0 ? Math.max(...expenses.map(e => e.id)) + 1 : 1,
    title,
    amount,
  };
  expenses.push(newExpense);
  res.status(201).json(newExpense);
});

// API 4: Get all income
app.get("/api/income", (req, res) => {
  res.json(income);
});

// API 5: Add new income
app.post("/api/income", (req, res) => {
  const { source, amount } = req.body;
  if (!source || !amount) {
    return res.status(400).json({ error: "Source and amount required" });
  }
  const newIncome = {
    id: income.length > 0 ? Math.max(...income.map(i => i.id)) + 1 : 1,
    source,
    amount,
  };
  income.push(newIncome);
  res.status(201).json(newIncome);
});

// Expose internal functions for testing
module.exports = app;
module.exports._internal = {
  _resetData: () => {
    expenses = [
      { id: 1, title: "Groceries", amount: 500 },
      { id: 2, title: "Fuel", amount: 300 },
    ];
    income = [
      { id: 1, source: "Salary", amount: 10000 },
      { id: 2, source: "Freelance", amount: 2000 },
    ];
  },
  getDashboardSummary,
};
