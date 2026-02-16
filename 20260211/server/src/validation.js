const EXPENSE_CATEGORIES = ["Food", "Travel", "Rent", "Shopping"];
const INCOME_CATEGORIES = ["Salary"];
const CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];
const TRANSACTION_TYPES = ["income", "expense"];

const validateAmount = (value) => {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false, message: "Amount must be a positive number." };
  }
  return { ok: true, amount };
};

const validateCategory = (value, type) => {
  const allowed = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  if (!allowed.includes(value)) {
    return { ok: false, message: "Invalid category." };
  }
  return { ok: true, category: value };
};

const validateType = (value) => {
  if (!TRANSACTION_TYPES.includes(value)) {
    return { ok: false, message: "Invalid transaction type." };
  }
  return { ok: true, type: value };
};

module.exports = {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  CATEGORIES,
  TRANSACTION_TYPES,
  validateAmount,
  validateCategory,
  validateType
};
