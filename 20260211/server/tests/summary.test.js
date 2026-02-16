const { buildSummary, sumAmounts } = require("../src/summary");

describe("summary calculations", () => {
  test("sums income and expenses", () => {
    const incomes = [{ amount: 100 }, { amount: 250 }];
    const expenses = [{ amount: 50 }, { amount: 25 }];
    const summary = buildSummary(incomes, expenses);

    expect(summary.totalIncome).toBe(350);
    expect(summary.totalExpenses).toBe(75);
  });

  test("calculates balance", () => {
    const summary = buildSummary([{ amount: 200 }], [{ amount: 80 }]);
    expect(summary.balance).toBe(120);
  });

  test("sumAmounts handles empty lists", () => {
    expect(sumAmounts([])).toBe(0);
  });
});
