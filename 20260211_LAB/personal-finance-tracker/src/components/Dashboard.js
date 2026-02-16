import { formatCurrency } from "../utils/format";
import { CashflowChart, CategoryBreakdownChart } from "./Charts";
import TransactionList from "./TransactionList";

function Dashboard({
  stats,
  recent,
  budgets,
  currency,
  categoryMap,
  accountMap,
  cashflowSeries,
  topCategories
}) {
  return (
    <section className="page-section">
      <div className="page-header">
        <h2>Dashboard</h2>
        <span className="pill">{stats.month}</span>
      </div>
      <div className="grid three">
        <div className="card">
          <div className="stat-label">Total balance</div>
          <div className="stat-value">
            {formatCurrency(stats.balance, currency)}
          </div>
          <div className="stat-caption">Across all accounts</div>
        </div>
        <div className="card">
          <div className="stat-label">Monthly income</div>
          <div className="stat-value">
            {formatCurrency(stats.income, currency)}
          </div>
          <div className="stat-caption">Tracked so far</div>
        </div>
        <div className="card">
          <div className="stat-label">Monthly expenses</div>
          <div className="stat-value">
            {formatCurrency(stats.expenses, currency)}
          </div>
          <div className="stat-caption">Tracked so far</div>
        </div>
      </div>
      <div className="grid two">
        <div className="card">
          <CashflowChart series={cashflowSeries} currency={currency} />
        </div>
        <div className="card">
          <CategoryBreakdownChart items={topCategories} currency={currency} />
        </div>
      </div>
      <div className="grid two">
        <div className="card">
          <h3>Recent activity</h3>
          <TransactionList
            transactions={recent}
            categoryMap={categoryMap}
            accountMap={accountMap}
            currency={currency}
            emptyMessage="No recent transactions yet."
          />
        </div>
        <div className="card">
          <h3>Budgets overview</h3>
          <div className="list">
            {budgets.length ? (
              budgets.map((budget) => (
                <div className="list-item" key={budget.id}>
                  <div>
                    <div className="list-title">{budget.name}</div>
                    <div className="list-subtitle">
                      {formatCurrency(budget.spent, currency)} of
                      {" "}
                      {formatCurrency(budget.limit, currency)}
                    </div>
                    <div className="budget-bar">
                      <div
                        className="budget-fill"
                        style={{ width: `${budget.progress * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="pill">
                    {Math.round(budget.progress * 100)}%
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                Set a budget to keep spending on track.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;