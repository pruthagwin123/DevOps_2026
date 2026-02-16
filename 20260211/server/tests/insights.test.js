const { buildInsights } = require("../src/summary");

describe("insights generation", () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date("2026-02-15T10:00:00.000Z"));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test("reports top category and month-over-month change", () => {
    const transactions = [
      {
        type: "expense",
        amount: 120,
        category: "Food",
        description: "Zomato",
        createdAt: "2026-02-10T09:00:00.000Z"
      },
      {
        type: "expense",
        amount: 40,
        category: "Travel",
        description: "Uber",
        createdAt: "2026-02-11T09:00:00.000Z"
      },
      {
        type: "expense",
        amount: 20,
        category: "Food",
        description: "Cafe",
        createdAt: "2026-01-20T09:00:00.000Z"
      }
    ];

    const insights = buildInsights(transactions);

    expect(insights.some((item) => item.includes("Food"))).toBe(true);
    expect(
      insights.some((item) => item.includes("increased compared to last month"))
    ).toBe(true);
  });
});
