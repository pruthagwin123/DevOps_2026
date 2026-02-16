import { formatCurrency } from "../utils/format";
import { CategoryBreakdownChart } from "./Charts";

function Reports({ summary, topCategories, currency, onExportCsv }) {
  return (
    <section className="page-section">
      <div className="page-header">
        <h2>Reports</h2>
        <button className="button" type="button" onClick={onExportCsv}>
          Export CSV
        </button>
      </div>
      <div className="grid three">
        <div className="card">
          <div className="stat-label">Income</div>
          <div className="stat-value">{formatCurrency(summary.income, currency)}</div>
        </div>
        <div className="card">
          <div className="stat-label">Expenses</div>
          <div className="stat-value">{formatCurrency(summary.expenses, currency)}</div>
        </div>
        <div className="card">
          <div className="stat-label">Net</div>
          <div className="stat-value">{formatCurrency(summary.net, currency)}</div>
        </div>
      </div>
      <div className="grid two">
        <div className="card">
          <CategoryBreakdownChart items={topCategories} currency={currency} />
        </div>
        <div className="card">
          <h3>Top spending categories</h3>
          <div className="list">
            {topCategories.length ? (
              topCategories.map((item) => (
                <div className="list-item" key={item.id}>
                  <div className="list-title">{item.name}</div>
                  <div className="amount expense">
                    {formatCurrency(item.total, currency)}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                Add expenses to populate your report.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Reports;
