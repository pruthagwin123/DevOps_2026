import { formatCurrency } from "../utils/format";

function Accounts({ accounts, categories, currency, onAddAccount, onAddCategory }) {
  const handleAccountSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name");
    const type = formData.get("type");
    const openingBalance = Number(formData.get("openingBalance"));

    if (!name || !type) {
      return;
    }

    onAddAccount({ name, type, openingBalance });
    event.currentTarget.reset();
  };

  const handleCategorySubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name");
    const type = formData.get("type");

    if (!name || !type) {
      return;
    }

    onAddCategory({ name, type });
    event.currentTarget.reset();
  };

  return (
    <section className="page-section">
      <div className="page-header">
        <h2>Accounts</h2>
      </div>
      <div className="grid two">
        <div className="card">
          <h3>Add account</h3>
          <form className="form" onSubmit={handleAccountSubmit}>
            <div className="form-row">
              <label>
                Name
                <input className="input" name="name" type="text" />
              </label>
              <label>
                Type
                <select className="input" name="type" defaultValue="">
                  <option value="">Select</option>
                  <option value="bank">Bank</option>
                  <option value="savings">Savings</option>
                  <option value="cash">Cash</option>
                  <option value="credit">Credit</option>
                </select>
              </label>
              <label>
                Opening balance
                <input
                  className="input"
                  name="openingBalance"
                  type="number"
                  step="1"
                  defaultValue="0"
                />
              </label>
            </div>
            <button className="button primary" type="submit">
              Save account
            </button>
          </form>
        </div>
        <div className="card">
          <h3>Account list</h3>
          <div className="list">
            {accounts.length ? (
              accounts.map((account) => (
                <div className="list-item" key={account.id}>
                  <div>
                    <div className="list-title">{account.name}</div>
                    <div className="list-subtitle">{account.type}</div>
                  </div>
                  <div className="amount">
                    {formatCurrency(account.balance ?? account.openingBalance, currency)}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                Add your first account to track balances.
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="grid two">
        <div className="card">
          <h3>Add category</h3>
          <form className="form" onSubmit={handleCategorySubmit}>
            <div className="form-row">
              <label>
                Name
                <input className="input" name="name" type="text" />
              </label>
              <label>
                Type
                <select className="input" name="type" defaultValue="">
                  <option value="">Select</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </label>
            </div>
            <button className="button" type="submit">
              Save category
            </button>
          </form>
        </div>
        <div className="card">
          <h3>Categories</h3>
          <div className="pill-group">
            {categories.length ? (
              categories.map((category) => (
                <span className="pill" key={category.id}>
                  {category.name}
                </span>
              ))
            ) : (
              <div className="empty-state">
                Create income and expense categories to organize entries.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Accounts;
