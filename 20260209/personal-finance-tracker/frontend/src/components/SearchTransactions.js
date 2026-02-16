import React from 'react';
import '../styles/SearchTransactions.css';

const SearchTransactions = ({ onSearch, loading }) => {
  const handleSearchChange = (e) => {
    onSearch(e.target.value);
  };

  return (
    <div className="search-transactions">
      <h3>🔍 Search Transactions</h3>
      <div className="search-input-wrapper">
        <input
          type="text"
          placeholder="Search by description..."
          onChange={handleSearchChange}
          disabled={loading}
          className="search-input"
        />
        <span className="search-icon">🔎</span>
      </div>
    </div>
  );
};

export default SearchTransactions;
