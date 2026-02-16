import { useState } from "react";

function TransactionForm({
  onSubmit,
  categories,
  accounts,
  initialType = "expense",
  showType = true
}) {
  const [type, setType] = useState(initialType);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [accountId, setAccountId] = useState("");
  const [notes, setNotes] = useState("");

  const availableCategories = categories.filter((category) =>
    showType ? category.type === type : category.type === initialType
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!amount || !date || !categoryId || !accountId) {
      return;
    }

    onSubmit({
      type: showType ? type : initialType,
      amount: Number(amount),
      date,
      categoryId,
      accountId,
      notes
    });

    setAmount("");
    setDate("");
    setCategoryId("");
    setAccountId("");
    setNotes("");
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-row">
        {showType ? (
          <label>
            Type
            <select
              className="input"
              value={type}
              onChange={(event) => setType(event.target.value)}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </label>
        ) : null}
        <label>
          Amount
          <input
            className="input"
            type="number"
            min="0"
            step="1"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="0"
          />
        </label>
        <label>
          Date
          <input
            className="input"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </label>
      </div>
      <div className="form-row">
        <label>
          Category
          <select
            className="input"
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
          >
            <option value="">Select</option>
            {availableCategories.map((category) => (
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
            value={accountId}
            onChange={(event) => setAccountId(event.target.value)}
          >
            <option value="">Select</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Notes
          <input
            className="input"
            type="text"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Optional"
          />
        </label>
      </div>
      <button className="button primary" type="submit">
        Add transaction
      </button>
    </form>
  );
}

export default TransactionForm;
