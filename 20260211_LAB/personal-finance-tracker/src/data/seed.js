export const seedData = {
  user: {
    name: "Harsha",
    currency: "INR",
    theme: "sunrise",
    mode: "dark"
  },
  accounts: [
    {
      id: "acct-1",
      name: "Everyday Checking",
      type: "bank",
      openingBalance: 12000
    },
    {
      id: "acct-2",
      name: "Savings Vault",
      type: "savings",
      openingBalance: 45000
    },
    {
      id: "acct-3",
      name: "Credit Card",
      type: "credit",
      openingBalance: -3200
    }
  ],
  categories: [
    { id: "cat-1", name: "Salary", type: "income" },
    { id: "cat-2", name: "Freelance", type: "income" },
    { id: "cat-3", name: "Groceries", type: "expense" },
    { id: "cat-4", name: "Rent", type: "expense" },
    { id: "cat-5", name: "Transport", type: "expense" },
    { id: "cat-6", name: "Dining", type: "expense" },
    { id: "cat-7", name: "Utilities", type: "expense" }
  ],
  transactions: [
    {
      id: "tx-1",
      type: "income",
      amount: 60000,
      date: "2026-02-01",
      categoryId: "cat-1",
      accountId: "acct-1",
      notes: "February salary",
      tags: ["payroll"]
    },
    {
      id: "tx-2",
      type: "expense",
      amount: 12000,
      date: "2026-02-02",
      categoryId: "cat-4",
      accountId: "acct-1",
      notes: "Rent payment",
      tags: ["housing"]
    },
    {
      id: "tx-3",
      type: "expense",
      amount: 2400,
      date: "2026-02-03",
      categoryId: "cat-3",
      accountId: "acct-1",
      notes: "Weekly groceries",
      tags: ["food"]
    },
    {
      id: "tx-4",
      type: "expense",
      amount: 850,
      date: "2026-02-04",
      categoryId: "cat-5",
      accountId: "acct-1",
      notes: "Metro pass",
      tags: ["commute"]
    },
    {
      id: "tx-5",
      type: "income",
      amount: 9000,
      date: "2026-02-06",
      categoryId: "cat-2",
      accountId: "acct-2",
      notes: "Design project",
      tags: ["side-work"]
    }
  ],
  budgets: [
    {
      id: "bud-1",
      categoryId: "cat-3",
      month: "2026-02",
      limit: 8000
    },
    {
      id: "bud-2",
      categoryId: "cat-6",
      month: "2026-02",
      limit: 3500
    },
    {
      id: "bud-3",
      categoryId: "cat-5",
      month: "2026-02",
      limit: 2500
    }
  ]
};
