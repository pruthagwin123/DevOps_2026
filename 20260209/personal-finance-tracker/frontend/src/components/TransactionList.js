import React from 'react';
import { formatCurrency, formatDate } from '../utils';
import '../styles/TransactionList.css';

const TransactionList = ({ transactions, onDelete, loading }) => {
  if (loading) {
    return <div className="loading-text">Loading transactions...</div>;
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="empty-state">
        <p>📭 No transactions found</p>
      </div>
    );
  }

  return (
    <div className="transaction-list">
      <h3>📋 Recent Transactions</h3>
      <div className="table-container">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn.id} className={`transaction-row ${txn.type}`}>
                <td className="date-cell">{formatDate(txn.date)}</td>
                <td className="category-cell">
                  <span className="category-badge">{txn.category}</span>
                </td>
                <td className="description-cell">{txn.description}</td>
                <td className="type-cell">
                  <span className={`type-badge ${txn.type}`}>
                    {txn.type === 'income' ? '📈 Income' : '📉 Expense'}
                  </span>
                </td>
                <td className={`amount-cell ${txn.type}`}>
                  {txn.type === 'income' ? '+' : '-'}
                  {formatCurrency(txn.amount)}
                </td>
                <td className="action-cell">
                  <button
                    className="delete-btn"
                    onClick={() => onDelete(txn.id)}
                    title="Delete transaction"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;
