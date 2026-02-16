import React from 'react';
import { exportToCSV } from '../utils';
import '../styles/ExportData.css';

const ExportData = ({ transactions, loading }) => {
  const handleExport = () => {
    if (!transactions || transactions.length === 0) {
      alert('No transactions to export');
      return;
    }
    const filename = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    exportToCSV(transactions, filename);
  };

  return (
    <div className="export-data">
      <button
        className="export-btn"
        onClick={handleExport}
        disabled={loading || !transactions || transactions.length === 0}
        title="Export transactions to CSV"
      >
        📥 Export to CSV
      </button>
    </div>
  );
};

export default ExportData;
