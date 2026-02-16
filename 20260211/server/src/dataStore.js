const fs = require("fs");
const path = require("path");
const { buildSummary } = require("./summary");

const dataFile = path.join(__dirname, "..", "data", "finance.json");

let state = {
  users: []
};

const normalizeUser = (user) => {
  return {
    username: user.username,
    pin: user.pin,
    incomes: Array.isArray(user.incomes) ? user.incomes : [],
    expenses: Array.isArray(user.expenses) ? user.expenses : [],
    transactions: Array.isArray(user.transactions) ? user.transactions : []
  };
};

const hydrateTransactions = (user) => {
  if (user.transactions.length > 0) {
    return user;
  }

  const incomeTransactions = user.incomes.map((entry) => ({
    type: "income",
    amount: entry.amount,
    category: entry.category || "Salary",
    description: entry.description || "",
    createdAt: entry.createdAt
  }));

  const expenseTransactions = user.expenses.map((entry) => ({
    type: "expense",
    amount: entry.amount,
    category: entry.category,
    description: entry.description || "",
    createdAt: entry.createdAt
  }));

  user.transactions = [...incomeTransactions, ...expenseTransactions];
  return user;
};

const loadState = () => {
  try {
    const raw = fs.readFileSync(dataFile, "utf-8");
    const parsed = JSON.parse(raw);

    if (Array.isArray(parsed.users)) {
      state.users = parsed.users.map((user) =>
        hydrateTransactions(normalizeUser(user))
      );
    } else {
      const legacyUser = hydrateTransactions(
        normalizeUser({
          username: "demo",
          pin: "1234",
          incomes: parsed.incomes || [],
          expenses: parsed.expenses || [],
          transactions: parsed.transactions || []
        })
      );
      state.users = [legacyUser];
    }
  } catch (error) {
    state = { users: [] };
  }
};

const persistState = () => {
  fs.writeFileSync(dataFile, JSON.stringify(state, null, 2));
};

const findUser = (username) =>
  state.users.find(
    (user) => user.username.toLowerCase() === username.toLowerCase()
  );

const upsertUser = (username, pin) => {
  const existing = findUser(username);
  if (existing) {
    return { ok: existing.pin === pin, user: existing };
  }

  const user = normalizeUser({ username, pin, incomes: [], expenses: [] });
  state.users.push(user);
  persistState();
  return { ok: true, user };
};

const addIncome = (username, entry) => {
  const user = findUser(username);
  user.incomes.push(entry);
  user.transactions.push({
    type: "income",
    amount: entry.amount,
    category: entry.category || "Salary",
    description: entry.description || "",
    createdAt: entry.createdAt
  });
  persistState();
  return buildSummary(user.incomes, user.expenses, user.transactions);
};

const addExpense = (username, entry) => {
  const user = findUser(username);
  user.expenses.push(entry);
  user.transactions.push({
    type: "expense",
    amount: entry.amount,
    category: entry.category,
    description: entry.description || "",
    createdAt: entry.createdAt
  });
  persistState();
  return buildSummary(user.incomes, user.expenses, user.transactions);
};

const addTransaction = (username, entry) => {
  const user = findUser(username);
  user.transactions.push(entry);
  if (entry.type === "income") {
    user.incomes.push({
      amount: entry.amount,
      category: entry.category,
      description: entry.description,
      createdAt: entry.createdAt
    });
  }

  if (entry.type === "expense") {
    user.expenses.push({
      amount: entry.amount,
      category: entry.category,
      description: entry.description,
      createdAt: entry.createdAt
    });
  }

  persistState();
  return buildSummary(user.incomes, user.expenses, user.transactions);
};

const getSummary = (username) => {
  const user = findUser(username);
  return buildSummary(user.incomes, user.expenses, user.transactions);
};

const getTransactions = (username) => {
  const user = findUser(username);
  return user.transactions;
};

const getState = () => state;

const resetState = () => {
  state = { users: [] };
  persistState();
};

module.exports = {
  loadState,
  upsertUser,
  addIncome,
  addExpense,
  addTransaction,
  getSummary,
  getTransactions,
  resetState,
  getState,
  findUser
};
