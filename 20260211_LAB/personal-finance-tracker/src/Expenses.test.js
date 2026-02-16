import { render, screen } from "@testing-library/react";
import Expenses from "./components/Expenses";

test("renders Expenses heading", () => {
  render(
    <Expenses
      transactions={[]}
      categories={[{ id: "cat-1", name: "Rent", type: "expense" }]}
      accounts={[{ id: "acct-1", name: "Checking" }]}
      categoryMap={new Map([["cat-1", { name: "Rent" }]])}
      accountMap={new Map([["acct-1", { name: "Checking" }]])}
      currency="INR"
      onAddTransaction={() => {}}
    />
  );
  expect(
    screen.getByRole("heading", { name: /Expenses/i })
  ).toBeInTheDocument();
});