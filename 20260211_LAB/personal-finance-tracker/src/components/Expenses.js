import TransactionForm from "./TransactionForm";
import TransactionList from "./TransactionList";

function Expenses({
  transactions,
  categories,
  accounts,
  categoryMap,
  accountMap,
  currency,
  onAddTransaction
}) {
  return (
    <section className="page-section">
      <div className="page-header">
        <h2>Expenses</h2>
      </div>
      <div className="grid two">
        <div className="card">
          <h3>Log expense</h3>
          <TransactionForm
            onSubmit={onAddTransaction}
            categories={categories.filter((category) => category.type === "expense")}
            accounts={accounts}
            initialType="expense"
            showType={false}
          />
        </div>
        <div className="card">
          <h3>Recent expenses</h3>
          <TransactionList
            transactions={transactions}
            categoryMap={categoryMap}
            accountMap={accountMap}
            currency={currency}
            emptyMessage="No expenses yet. Log your first spend."
          />
        </div>
      </div>
    </section>
  );
}

export default Expenses;
