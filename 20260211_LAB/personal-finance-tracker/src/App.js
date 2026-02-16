import { useEffect, useMemo, useState } from "react";
import "./App.css";
import Accounts from "./components/Accounts";
import AuthScreen from "./components/AuthScreen";
import Budgets from "./components/Budgets";
import Dashboard from "./components/Dashboard";
import Expenses from "./components/Expenses";
import Income from "./components/Income";
import Onboarding from "./components/Onboarding";
import Reports from "./components/Reports";
import Settings from "./components/Settings";
import ToastStack from "./components/ToastStack";
import Transactions from "./components/Transactions";
import { seedData } from "./data/seed";
import { formatCurrency, getMonthKey, toCsv } from "./utils/format";
import { loadAuth, loadData, saveAuth, saveData } from "./utils/storage";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "transactions", label: "Transactions" },
  { id: "income", label: "Income" },
  { id: "expenses", label: "Expenses" },
  { id: "budgets", label: "Budgets" },
  { id: "reports", label: "Reports" },
  { id: "accounts", label: "Accounts" },
  { id: "settings", label: "Settings" }
];

const createId = (prefix) =>
  `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

function App() {
  const [data, setData] = useState(() => loadData(seedData));
  const [activeView, setActiveView] = useState("dashboard");
  const [filters, setFilters] = useState(() => ({
    query: "",
    accountId: "all",
    categoryId: "all",
    month: getMonthKey(new Date()),
    type: "all"
  }));
  const [toasts, setToasts] = useState([]);
  const [isAuthed, setIsAuthed] = useState(() => loadAuth());
  const user = data.user || {};
  const currency = user.currency || "INR";
  const theme = user.theme || "sunrise";
  const mode = user.mode || "dark";
  const displayName = user.name || "Friend";

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    document.body.classList.remove(
      "theme-sunrise",
      "theme-ocean",
      "mode-light",
      "mode-dark"
    );
    document.body.classList.add(`theme-${theme}`, `mode-${mode}`);
  }, [mode, theme]);

  useEffect(() => {
    saveData(data);
  }, [data]);

  useEffect(() => {
    saveAuth(isAuthed);
  }, [isAuthed]);

  const categoryMap = useMemo(
    () => new Map(data.categories.map((category) => [category.id, category])),
    [data.categories]
  );

  const accountMap = useMemo(
    () => new Map(data.accounts.map((account) => [account.id, account])),
    [data.accounts]
  );

  const currentMonthTransactions = useMemo(
    () =>
      data.transactions.filter((tx) => tx.date.startsWith(filters.month)),
    [data.transactions, filters.month]
  );

  const baseFilteredTransactions = useMemo(() => {
    const query = filters.query.trim().toLowerCase();

    return currentMonthTransactions.filter((tx) => {
      if (filters.accountId !== "all" && tx.accountId !== filters.accountId) {
        return false;
      }
      if (filters.categoryId !== "all" && tx.categoryId !== filters.categoryId) {
        return false;
      }
      if (!query) {
        return true;
      }

      const category = categoryMap.get(tx.categoryId)?.name || "";
      const haystack = `${tx.notes || ""} ${category}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [categoryMap, currentMonthTransactions, filters.accountId, filters.categoryId, filters.query]);

  const filteredTransactions = useMemo(() => {
    if (filters.type === "all") {
      return baseFilteredTransactions;
    }
    return baseFilteredTransactions.filter((tx) => tx.type === filters.type);
  }, [baseFilteredTransactions, filters.type]);

  const incomeTransactions = useMemo(
    () => baseFilteredTransactions.filter((tx) => tx.type === "income"),
    [baseFilteredTransactions]
  );

  const expenseTransactions = useMemo(
    () => baseFilteredTransactions.filter((tx) => tx.type === "expense"),
    [baseFilteredTransactions]
  );

  const accountBalances = useMemo(() => {
    const balances = new Map();
    data.accounts.forEach((account) => {
      balances.set(account.id, account.openingBalance || 0);
    });

    data.transactions.forEach((tx) => {
      const current = balances.get(tx.accountId) || 0;
      const delta = tx.type === "income" ? tx.amount : -tx.amount;
      balances.set(tx.accountId, current + delta);
    });

    return balances;
  }, [data.accounts, data.transactions]);

  const totalBalance = useMemo(() => {
    let total = 0;
    accountBalances.forEach((value) => {
      total += value;
    });
    return total;
  }, [accountBalances]);

  const incomeTotal = useMemo(
    () =>
      currentMonthTransactions
        .filter((tx) => tx.type === "income")
        .reduce((sum, tx) => sum + tx.amount, 0),
    [currentMonthTransactions]
  );

  const expenseTotal = useMemo(
    () =>
      currentMonthTransactions
        .filter((tx) => tx.type === "expense")
        .reduce((sum, tx) => sum + tx.amount, 0),
    [currentMonthTransactions]
  );

  const recentTransactions = useMemo(
    () =>
      [...data.transactions]
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 6),
    [data.transactions]
  );

  const budgetSummaries = useMemo(() => {
    return data.budgets
      .filter((budget) => budget.month === filters.month)
      .map((budget) => {
        const spent = currentMonthTransactions
          .filter(
            (tx) =>
              tx.type === "expense" && tx.categoryId === budget.categoryId
          )
          .reduce((sum, tx) => sum + tx.amount, 0);
        const progress = budget.limit ? spent / budget.limit : 0;
        const name = categoryMap.get(budget.categoryId)?.name || "Category";

        return {
          ...budget,
          name,
          spent,
          progress
        };
      });
  }, [categoryMap, currentMonthTransactions, data.budgets, filters.month]);

  const reportSummary = useMemo(
    () => ({
      income: incomeTotal,
      expenses: expenseTotal,
      net: incomeTotal - expenseTotal
    }),
    [incomeTotal, expenseTotal]
  );

  const topCategories = useMemo(() => {
    const totals = new Map();

    currentMonthTransactions.forEach((tx) => {
      if (tx.type !== "expense") {
        return;
      }
      totals.set(tx.categoryId, (totals.get(tx.categoryId) || 0) + tx.amount);
    });

    return [...totals.entries()]
      .map(([id, total]) => ({
        id,
        name: categoryMap.get(id)?.name || "Category",
        total
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [categoryMap, currentMonthTransactions]);

  const addToast = (message) => {
    const id = createId("toast");
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3200);
  };

  const handleAddTransaction = (payload) => {
    const newTransaction = {
      id: createId("tx"),
      tags: [],
      ...payload
    };

    setData((prev) => ({
      ...prev,
      transactions: [newTransaction, ...prev.transactions]
    }));
    addToast("Transaction added");
  };

  const handleAddAccount = (payload) => {
    const newAccount = {
      id: createId("acct"),
      openingBalance: payload.openingBalance || 0,
      ...payload
    };

    setData((prev) => ({
      ...prev,
      accounts: [...prev.accounts, newAccount]
    }));
    addToast("Account created");
  };

  const handleAddCategory = (payload) => {
    const newCategory = {
      id: createId("cat"),
      ...payload
    };

    setData((prev) => ({
      ...prev,
      categories: [...prev.categories, newCategory]
    }));
    addToast("Category added");
  };

  const handleAddBudget = (payload) => {
    const newBudget = {
      id: createId("bud"),
      ...payload
    };

    setData((prev) => ({
      ...prev,
      budgets: [...prev.budgets, newBudget]
    }));
    addToast("Budget saved");
  };

  const handleExportCsv = () => {
    const csv = toCsv(currentMonthTransactions, categoryMap, accountMap);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `transactions-${filters.month}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
    addToast("CSV exported");
  };

  const handleUpdateUser = (payload) => {
    setData((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        ...payload
      }
    }));
    addToast("Settings saved");
  };

  const handleResetDemo = () => {
    const confirmed = window.confirm(
      "Reset to demo data? This will replace your current local data."
    );
    if (!confirmed) {
      return;
    }

    setData(seedData);
    addToast("Demo data restored");
  };

  const hasAccounts = data.accounts.length > 0;
  const hasCategories = data.categories.length > 0;
  const hasTransactions = data.transactions.length > 0;

  const cashflowSeries = useMemo(() => {
    const [yearValue, monthValue] = filters.month.split("-").map(Number);
    if (!yearValue || !monthValue) {
      return [];
    }

    const daysInMonth = new Date(yearValue, monthValue, 0).getDate();
    const daily = Array.from({ length: daysInMonth }, (_, index) => ({
      label: String(index + 1).padStart(2, "0"),
      value: 0
    }));

    currentMonthTransactions.forEach((tx) => {
      const day = Number(tx.date.slice(8, 10));
      if (!Number.isNaN(day) && daily[day - 1]) {
        daily[day - 1].value += tx.type === "income" ? tx.amount : -tx.amount;
      }
    });

    return daily;
  }, [currentMonthTransactions, filters.month]);

  const handleToggleMode = () => {
    handleUpdateUser({ mode: mode === "dark" ? "light" : "dark" });
  };

  if (!isAuthed) {
    return <AuthScreen onSignIn={() => setIsAuthed(true)} />;
  }

  return (
    <div className={`app-shell theme-${theme} mode-${mode}`}>
      <ToastStack toasts={toasts} />
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark">PFT</div>
          <div>
            <div className="brand-title">Finance Tracker</div>
            <div className="brand-subtitle">Frontend MVP</div>
          </div>
        </div>
        <nav className="nav-list">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`nav-button ${
                activeView === item.id ? "active" : ""
              }`}
              type="button"
              onClick={() => setActiveView(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="pill">Local storage</div>
          <div className="muted">
            Balance: {formatCurrency(totalBalance, currency)}
          </div>
        </div>
      </aside>
      <main className="main">
        <header className="topbar">
          <div>
            <h1>Personal Finance Tracker</h1>
            <div className="muted">
              Welcome back, {displayName} · {filters.month} overview
            </div>
          </div>
          <div className="topbar-actions">
            <button
              className={`appearance-toggle ${
                mode === "dark" ? "is-dark" : "is-light"
              }`}
              type="button"
              onClick={handleToggleMode}
              aria-pressed={mode === "dark"}
              aria-label="Toggle light or dark mode"
            >
              <span className="toggle-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
                  <circle cx="12" cy="12" r="4" />
                  <line x1="12" y1="1" x2="12" y2="4" />
                  <line x1="12" y1="20" x2="12" y2="23" />
                  <line x1="4.2" y1="4.2" x2="6.4" y2="6.4" />
                  <line x1="17.6" y1="17.6" x2="19.8" y2="19.8" />
                  <line x1="1" y1="12" x2="4" y2="12" />
                  <line x1="20" y1="12" x2="23" y2="12" />
                  <line x1="4.2" y1="19.8" x2="6.4" y2="17.6" />
                  <line x1="17.6" y1="6.4" x2="19.8" y2="4.2" />
                </svg>
              </span>
              <span className="toggle-track" aria-hidden="true">
                <span className="toggle-thumb" />
              </span>
              <span className="toggle-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
                  <path d="M21 14.5A9.5 9.5 0 0 1 9.5 3a7.5 7.5 0 1 0 11.5 11.5z" />
                </svg>
              </span>
            </button>
            <button
              className="button"
              type="button"
              onClick={() => setIsAuthed(false)}
            >
              Sign out
            </button>
          </div>
        </header>

        {activeView === "dashboard" ? (
          <>
            <Onboarding
              hasAccounts={hasAccounts}
              hasCategories={hasCategories}
              hasTransactions={hasTransactions}
              onNavigate={setActiveView}
            />
            <Dashboard
              stats={{
                balance: totalBalance,
                income: incomeTotal,
                expenses: expenseTotal,
                month: filters.month
              }}
              recent={recentTransactions}
              budgets={budgetSummaries}
              currency={currency}
              categoryMap={categoryMap}
              accountMap={accountMap}
              cashflowSeries={cashflowSeries}
              topCategories={topCategories}
            />
          </>
        ) : null}

        {activeView === "transactions" ? (
          <Transactions
            filters={filters}
            onFilterChange={setFilters}
            onAddTransaction={handleAddTransaction}
            transactions={filteredTransactions}
            categories={data.categories}
            accounts={data.accounts}
            categoryMap={categoryMap}
            accountMap={accountMap}
            currency={currency}
          />
        ) : null}

        {activeView === "income" ? (
          <Income
            transactions={incomeTransactions}
            categories={data.categories}
            accounts={data.accounts}
            categoryMap={categoryMap}
            accountMap={accountMap}
            currency={currency}
            onAddTransaction={handleAddTransaction}
          />
        ) : null}

        {activeView === "expenses" ? (
          <Expenses
            transactions={expenseTransactions}
            categories={data.categories}
            accounts={data.accounts}
            categoryMap={categoryMap}
            accountMap={accountMap}
            currency={currency}
            onAddTransaction={handleAddTransaction}
          />
        ) : null}

        {activeView === "budgets" ? (
          <Budgets
            budgets={budgetSummaries}
            categories={data.categories}
            categoryMap={categoryMap}
            currency={currency}
            onAddBudget={handleAddBudget}
            month={filters.month}
          />
        ) : null}

        {activeView === "reports" ? (
          <Reports
            summary={reportSummary}
            topCategories={topCategories}
            currency={currency}
            onExportCsv={handleExportCsv}
          />
        ) : null}

        {activeView === "accounts" ? (
          <Accounts
            accounts={data.accounts.map((account) => ({
              ...account,
              balance: accountBalances.get(account.id)
            }))}
            categories={data.categories}
            currency={currency}
            onAddAccount={handleAddAccount}
            onAddCategory={handleAddCategory}
          />
        ) : null}

        {activeView === "settings" ? (
          <Settings
            user={user}
            onUpdateUser={handleUpdateUser}
            onResetDemo={handleResetDemo}
          />
        ) : null}
      </main>
    </div>
  );
}

export default App;
