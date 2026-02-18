const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Import routes
const dashboardRoutes = require('./routes/dashboard');
const expensesRoutes = require('./routes/expenses');
const incomeRoutes = require('./routes/income');

// Middleware to parse JSON request bodies
app.use(express.json());

// Use the routes
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/income', incomeRoutes);

// Health check route
app.get('/', (req, res) => {
  res.send('Personal Finance Tracker API is running');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});