const { EXPENSE_CATEGORIES } = require("./validation");

const sumAmounts = (items) =>
  items.reduce((total, item) => total + Number(item.amount || 0), 0);

const calculateExpenseByCategory = (expenses) => {
  const totals = EXPENSE_CATEGORIES.reduce((acc, category) => {
    acc[category] = 0;
    return acc;
  }, {});

  expenses.forEach((expense) => {
    if (totals[expense.category] !== undefined) {
      totals[expense.category] += Number(expense.amount || 0);
    }
  });

  return totals;
};

const totalsFromTransactions = (transactions) => {
  const incomeItems = transactions.filter((item) => item.type === "income");
  const expenseItems = transactions.filter((item) => item.type === "expense");

  return {
    totalIncome: sumAmounts(incomeItems),
    totalExpenses: sumAmounts(expenseItems),
    expenseByCategory: calculateExpenseByCategory(expenseItems)
  };
};

const getMonthKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const buildInsights = (transactions) => {
  const insights = [];
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return insights;
  }

  const now = new Date();
  const currentMonth = getMonthKey(now);
  const previousMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const previousMonth = getMonthKey(previousMonthDate);

  const currentExpenses = transactions.filter((item) => {
    if (item.type !== "expense") {
      return false;
    }
    const date = new Date(item.createdAt);
    return getMonthKey(date) === currentMonth;
  });

  const previousExpenses = transactions.filter((item) => {
    if (item.type !== "expense") {
      return false;
    }
    const date = new Date(item.createdAt);
    return getMonthKey(date) === previousMonth;
  });

  const byCategory = calculateExpenseByCategory(currentExpenses);
  const topCategory = Object.entries(byCategory).reduce(
    (max, entry) => (entry[1] > max[1] ? entry : max),
    ["", 0]
  );

  if (topCategory[1] > 0) {
    insights.push(`You spent more on ${topCategory[0]} this month.`);
  }

  const currentTotal = sumAmounts(currentExpenses);
  const previousTotal = sumAmounts(previousExpenses);
  if (previousTotal > 0 && currentTotal > previousTotal) {
    insights.push("Your expenses increased compared to last month.");
  }
  if (previousTotal > 0 && currentTotal < previousTotal) {
    insights.push("Your expenses decreased compared to last month.");
  }

  return insights;
};

const buildSummary = (incomes, expenses, transactions = []) => {
  const useTransactions = Array.isArray(transactions) && transactions.length > 0;
  const totals = useTransactions
    ? totalsFromTransactions(transactions)
    : {
        totalIncome: sumAmounts(incomes),
        totalExpenses: sumAmounts(expenses),
        expenseByCategory: calculateExpenseByCategory(expenses)
      };

  const balance = totals.totalIncome - totals.totalExpenses;
  const insights = useTransactions ? buildInsights(transactions) : [];

  return {
    totalIncome: totals.totalIncome,
    totalExpenses: totals.totalExpenses,
    balance,
    expenseByCategory: totals.expenseByCategory,
    insights
  };
};

module.exports = {
  buildSummary,
  sumAmounts,
  calculateExpenseByCategory,
  totalsFromTransactions,
  buildInsights
};
