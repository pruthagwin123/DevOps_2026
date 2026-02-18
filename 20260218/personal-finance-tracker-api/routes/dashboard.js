const express = require('express');
const router = express.Router();

// Dummy dashboard data
router.get('/', (req, res) => {
  const dashboardData = {
    totalIncome: 10000,
    totalExpenses: 5000,
    balance: 5000,
  };
  res.json(dashboardData);
});

module.exports = router;