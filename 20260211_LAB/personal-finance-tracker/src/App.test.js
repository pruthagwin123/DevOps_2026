import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders app heading", () => {
  window.localStorage.setItem("pft-authed", "true");
  render(<App />);
  expect(
    screen.getByRole("heading", { name: /Personal Finance Tracker/i })
  ).toBeInTheDocument();
  window.localStorage.removeItem("pft-authed");
});
