const express = require("express");
const cors = require("cors");
const session = require("express-session");
const {
  validateAmount,
  validateCategory,
  validateType
} = require("./validation");
const { filterTransactions, sortTransactions } = require("./transactionUtils");
const {
  loadState,
  upsertUser,
  findUser,
  addIncome,
  addExpense,
  addTransaction,
  getSummary,
  getTransactions
} = require("./dataStore");

const app = express();
const port = process.env.PORT || 4000;

loadState();

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || /^http:\/\/localhost:\d+$/.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  })
);
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 12
    }
  })
);

const requireAuth = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: "Login required." });
  }
  const user = findUser(req.session.user);
  if (!user) {
    return res.status(401).json({ error: "Login required." });
  }
  return next();
};

const validatePin = (pin) => /^\d{4}$/.test(pin);

app.post("/login", (req, res) => {
  const { username, pin } = req.body || {};
  const trimmed = String(username || "").trim();
  const pinValue = String(pin || "").trim();

  if (!trimmed) {
    return res.status(400).json({ error: "Username is required." });
  }

  if (!validatePin(pinValue)) {
    return res.status(400).json({ error: "PIN must be 4 digits." });
  }

  const result = upsertUser(trimmed, pinValue);
  if (!result.ok) {
    return res.status(401).json({ error: "Invalid PIN." });
  }

  req.session.user = result.user.username;
  return res.json({ user: { username: result.user.username } });
});

app.post("/logout", (req, res) => {
  if (!req.session) {
    return res.status(204).end();
  }
  req.session.destroy(() => res.status(204).end());
});

app.get("/me", (req, res) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: "Login required." });
  }
  const user = findUser(req.session.user);
  if (!user) {
    return res.status(401).json({ error: "Login required." });
  }
  return res.json({ user: { username: user.username } });
});

app.post("/income", requireAuth, (req, res) => {
  const { amount, category = "Salary", description = "" } = req.body || {};
  const amountCheck = validateAmount(amount);
  const categoryCheck = validateCategory(category, "income");

  if (!amountCheck.ok) {
    return res.status(400).json({ error: amountCheck.message });
  }

  if (!categoryCheck.ok) {
    return res.status(400).json({ error: categoryCheck.message });
  }

  const entry = {
    amount: amountCheck.amount,
    category: categoryCheck.category,
    description: String(description),
    createdAt: new Date().toISOString()
  };

  const summary = addIncome(req.session.user, entry);
  return res.status(201).json({ summary });
});

app.post("/expense", requireAuth, (req, res) => {
  const { amount, category, description = "" } = req.body || {};
  const amountCheck = validateAmount(amount);
  const categoryCheck = validateCategory(category, "expense");

  if (!amountCheck.ok) {
    return res.status(400).json({ error: amountCheck.message });
  }

  if (!categoryCheck.ok) {
    return res.status(400).json({ error: categoryCheck.message });
  }

  const entry = {
    amount: amountCheck.amount,
    category: categoryCheck.category,
    description: String(description),
    createdAt: new Date().toISOString()
  };

  const summary = addExpense(req.session.user, entry);
  return res.status(201).json({ summary });
});

app.get("/summary", requireAuth, (req, res) => {
  const summary = getSummary(req.session.user);
  return res.json({ summary });
});

app.post("/transaction", requireAuth, (req, res) => {
  const {
    type,
    amount,
    category,
    description = "",
    createdAt
  } = req.body || {};
  const typeCheck = validateType(type);
  const amountCheck = validateAmount(amount);
  const resolvedCategory = category || (type === "income" ? "Salary" : undefined);
  const categoryCheck = validateCategory(resolvedCategory, type);

  if (!typeCheck.ok) {
    return res.status(400).json({ error: typeCheck.message });
  }

  if (!amountCheck.ok) {
    return res.status(400).json({ error: amountCheck.message });
  }

  if (!categoryCheck.ok) {
    return res.status(400).json({ error: categoryCheck.message });
  }

  const entry = {
    type: typeCheck.type,
    amount: amountCheck.amount,
    category: categoryCheck.category,
    description: String(description),
    createdAt: createdAt || new Date().toISOString()
  };

  const summary = addTransaction(req.session.user, entry);
  return res.status(201).json({ summary, transaction: entry });
});

app.get("/transactions", requireAuth, (req, res) => {
  const { type, category, month, search } = req.query;
  const filtered = filterTransactions(getTransactions(req.session.user), {
    type,
    category,
    month,
    search
  });
  const transactions = sortTransactions(filtered);
  return res.json({ transactions });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Unexpected server error." });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
