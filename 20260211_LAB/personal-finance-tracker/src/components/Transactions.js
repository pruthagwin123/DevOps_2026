import TransactionForm from "./TransactionForm";
import TransactionList from "./TransactionList";

function Transactions({
  filters,
  onFilterChange,
  onAddTransaction,
  transactions,
  categories,
  accounts,
  categoryMap,
  accountMap,
  currency
}) {
  return (
    <section className="page-section">
      <div className="page-header">
        <h2>Transactions</h2>
      </div>
      <div className="card">
        <div className="form-row">
          <label>
            Search
            <input
              className="input"
              type="text"
              value={filters.query}
              onChange={(event) =>
                onFilterChange({ ...filters, query: event.target.value })
              }
              placeholder="Search notes or category"
            />
          </label>
          <label>
            Type
            <select
              className="input"
              value={filters.type}
              onChange={(event) =>
                onFilterChange({ ...filters, type: event.target.value })
              }
            >
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </label>
          <label>
            Month
            <input
              className="input"
              type="month"
              value={filters.month}
              onChange={(event) =>
                onFilterChange({ ...filters, month: event.target.value })
              }
            />
          </label>
        </div>
        <div className="form-row">
          <label>
            Category
            <select
              className="input"
              value={filters.categoryId}
              onChange={(event) =>
                onFilterChange({ ...filters, categoryId: event.target.value })
              }
            >
              <option value="all">All</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Account
            <select
              className="input"
              value={filters.accountId}
              onChange={(event) =>
                onFilterChange({ ...filters, accountId: event.target.value })
              }
            >
              <option value="all">All</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <div className="grid two">
        <div className="card">
          <h3>Add transaction</h3>
          <TransactionForm
            onSubmit={onAddTransaction}
            categories={categories}
            accounts={accounts}
            showType
          />
        </div>
        <div className="card">
          <h3>Activity</h3>
          <TransactionList
            transactions={transactions}
            categoryMap={categoryMap}
            accountMap={accountMap}
            currency={currency}
            emptyMessage="No transactions match your filters yet."
          />
        </div>
      </div>
    </section>
  );
}

export default Transactions;
