const express = require('express');
const router = express.Router();

// Dummy expenses data
router.get('/', (req, res) => {
  const expenses = [
    { id: 1, name: 'Groceries', amount: 200 },
    { id: 2, name: 'Rent', amount: 1000 },
  ];
  res.json(expenses);
});

module.exports = router;