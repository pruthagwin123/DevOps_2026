import { formatCurrency, formatDate } from "../utils/format";

function TransactionList({
  transactions,
  categoryMap,
  accountMap,
  currency,
  emptyMessage = "No transactions yet."
}) {
  if (!transactions.length) {
    return <div className="empty-state">{emptyMessage}</div>;
  }

  return (
    <div className="list">
      {transactions.map((tx) => {
        const category = categoryMap.get(tx.categoryId)?.name || "Uncategorized";
        const account = accountMap.get(tx.accountId)?.name || "Unknown";
        const amountClass = tx.type === "income" ? "income" : "expense";

        return (
          <div className="list-item" key={tx.id}>
            <div>
              <div className="list-title">{category}</div>
              <div className="list-subtitle">
                {formatDate(tx.date)} · {account}
              </div>
            </div>
            <div className={`amount ${amountClass}`}>
              {tx.type === "income" ? "+" : "-"}
              {formatCurrency(tx.amount, currency)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TransactionList;
