const {
  upsertUser,
  addTransaction,
  getSummary,
  getTransactions,
  resetState
} = require("../src/dataStore");
const { filterTransactions } = require("../src/transactionUtils");

const USERNAME = "demo";

describe("transaction storage", () => {
  beforeEach(() => {
    resetState();
    upsertUser(USERNAME, "1234");
  });

  test("stores a transaction entry", () => {
    const entry = {
      type: "expense",
      amount: 45,
      category: "Food",
      description: "Zomato",
      createdAt: "2026-02-11T10:00:00.000Z"
    };

    addTransaction(USERNAME, entry);
    const transactions = getTransactions(USERNAME);

    expect(transactions).toHaveLength(1);
    expect(transactions[0]).toMatchObject(entry);
  });

  test("calculates totals from transactions", () => {
    addTransaction(USERNAME, {
      type: "income",
      amount: 1000,
      category: "Salary",
      description: "Monthly Salary",
      createdAt: "2026-02-11T09:00:00.000Z"
    });
    addTransaction(USERNAME, {
      type: "expense",
      amount: 250,
      category: "Rent",
      description: "February Rent",
      createdAt: "2026-02-11T11:00:00.000Z"
    });

    const summary = getSummary(USERNAME);
    expect(summary.totalIncome).toBe(1000);
    expect(summary.totalExpenses).toBe(250);
    expect(summary.balance).toBe(750);
  });

  test("filters by type, category, month, and search", () => {
    const transactions = [
      {
        type: "income",
        amount: 500,
        category: "Salary",
        description: "Monthly Salary",
        createdAt: "2026-02-01T10:00:00.000Z"
      },
      {
        type: "expense",
        amount: 40,
        category: "Food",
        description: "Zomato",
        createdAt: "2026-02-05T12:00:00.000Z"
      },
      {
        type: "expense",
        amount: 60,
        category: "Travel",
        description: "Uber",
        createdAt: "2026-01-20T09:00:00.000Z"
      }
    ];

    const filtered = filterTransactions(transactions, {
      type: "expense",
      category: "Food",
      month: "2026-02",
      search: "zomato"
    });

    expect(filtered).toHaveLength(1);
    expect(filtered[0].description).toBe("Zomato");
  });
});
