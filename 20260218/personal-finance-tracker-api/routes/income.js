const express = require('express');
const router = express.Router();

// Dummy income data
router.get('/', (req, res) => {
  const income = [
    { id: 1, source: 'Salary', amount: 5000 },
    { id: 2, source: 'Freelance', amount: 2000 },
  ];
  res.json(income);
});

module.exports = router;