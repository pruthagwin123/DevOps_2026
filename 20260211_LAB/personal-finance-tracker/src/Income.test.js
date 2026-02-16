import { render, screen } from "@testing-library/react";
import Income from "./components/Income";

test("renders Income heading", () => {
  render(
    <Income
      transactions={[]}
      categories={[{ id: "cat-1", name: "Salary", type: "income" }]}
      accounts={[{ id: "acct-1", name: "Checking" }]}
      categoryMap={new Map([["cat-1", { name: "Salary" }]])}
      accountMap={new Map([["acct-1", { name: "Checking" }]])}
      currency="INR"
      onAddTransaction={() => {}}
    />
  );
  expect(
    screen.getByRole("heading", { name: /Income/i })
  ).toBeInTheDocument();
});