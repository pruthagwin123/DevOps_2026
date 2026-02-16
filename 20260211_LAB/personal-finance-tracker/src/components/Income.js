import TransactionForm from "./TransactionForm";
import TransactionList from "./TransactionList";

function Income({
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
        <h2>Income</h2>
      </div>
      <div className="grid two">
        <div className="card">
          <h3>Log income</h3>
          <TransactionForm
            onSubmit={onAddTransaction}
            categories={categories.filter((category) => category.type === "income")}
            accounts={accounts}
            initialType="income"
            showType={false}
          />
        </div>
        <div className="card">
          <h3>Recent income</h3>
          <TransactionList
            transactions={transactions}
            categoryMap={categoryMap}
            accountMap={accountMap}
            currency={currency}
            emptyMessage="No income entries yet. Add your first deposit."
          />
        </div>
      </div>
    </section>
  );
}

export default Income;
