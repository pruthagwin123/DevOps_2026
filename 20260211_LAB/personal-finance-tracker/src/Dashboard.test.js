import { render, screen } from "@testing-library/react";
import Dashboard from "./components/Dashboard";

test("renders Dashboard heading", () => {
  render(
    <Dashboard
      stats={{ balance: 0, income: 0, expenses: 0, month: "2026-02" }}
      recent={[]}
      budgets={[]}
      currency="INR"
      categoryMap={new Map()}
      accountMap={new Map()}
      cashflowSeries={[]}
    />
  );
  expect(
    screen.getByRole("heading", { name: /Dashboard/i })
  ).toBeInTheDocument();
});
