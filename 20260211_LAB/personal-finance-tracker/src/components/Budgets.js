import { formatCurrency } from "../utils/format";

function Budgets({
  budgets,
  categories,
  categoryMap,
  currency,
  onAddBudget,
  month
}) {
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const categoryId = formData.get("categoryId");
    const limit = Number(formData.get("limit"));

    if (!categoryId || !limit) {
      return;
    }

    onAddBudget({ categoryId, limit, month });
    event.currentTarget.reset();
  };

  return (
    <section className="page-section">
      <div className="page-header">
        <h2>Budgets</h2>
        <span className="pill">{month}</span>
      </div>
      <div className="grid two">
        <div className="card">
          <h3>Create budget</h3>
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-row">
              <label>
                Category
                <select className="input" name="categoryId" defaultValue="">
                  <option value="">Select</option>
                  {categories
                    .filter((category) => category.type === "expense")
                    .map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </select>
              </label>
              <label>
                Limit
                <input
                  className="input"
                  type="number"
                  min="0"
                  step="1"
                  name="limit"
                  placeholder="0"
                />
              </label>
            </div>
            <button className="button primary" type="submit">
              Save budget
            </button>
          </form>
        </div>
        <div className="card">
          <h3>Monthly budgets</h3>
          <div className="list">
            {budgets.length ? (
              budgets.map((budget) => {
                const name = categoryMap.get(budget.categoryId)?.name || "Category";
                const percent = Math.min(100, Math.round(budget.progress * 100));

                return (
                  <div className="list-item" key={budget.id}>
                    <div>
                      <div className="list-title">{name}</div>
                      <div className="list-subtitle">
                        {formatCurrency(budget.spent, currency)} spent of
                        {" "}
                        {formatCurrency(budget.limit, currency)}
                      </div>
                      <div className="budget-bar">
                        <div
                          className="budget-fill"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                    <div className="pill">{percent}%</div>
                  </div>
                );
              })
            ) : (
              <div className="empty-state">
                Create a monthly budget to track spending targets.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Budgets;
