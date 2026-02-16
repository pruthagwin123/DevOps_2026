/**
 * Utility functions for the Personal Finance Tracker
 */

/**
 * Format a number as currency (USD)
 * @param {number} value - The value to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value) => {
  if (value === null || value === undefined) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

/**
 * Get API base URL from environment or default
 * @returns {string} API base URL
 */
export const getApiBaseUrl = () => {
  return process.env.REACT_APP_API_URL || 'http://localhost:5000';
};

/**
 * Determine the status of the balance
 * @param {number} balance - The balance value
 * @returns {object} Object with status and color
 */
export const getBalanceStatus = (balance) => {
  if (balance > 0) {
    return { status: 'Positive', color: '#27ae60', className: 'balance-positive' };
  } else if (balance < 0) {
    return { status: 'Negative', color: '#e74c3c', className: 'balance-negative' };
  }
  return { status: 'Neutral', color: '#95a5a6', className: 'balance-neutral' };
};

/**
 * Format date to readable string
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Get all unique categories
 * @returns {array} Array of categories
 */
export const getAllCategories = () => {
  return [
    'Salary',
    'Bonus',
    'Food',
    'Transport',
    'Utilities',
    'Entertainment',
    'Healthcare',
    'Shopping',
    'Education',
    'Other'
  ];
};

/**
 * Export data to CSV format
 * @param {array} data - Array of transactions
 * @param {string} filename - Name of CSV file
 */
export const exportToCSV = (data, filename = 'transactions.csv') => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  const headers = ['ID', 'Type', 'Category', 'Amount', 'Description', 'Date', 'Recurring'];
  const rows = data.map(t => [
    t.id,
    t.type,
    t.category,
    t.amount,
    `"${t.description}"`,
    t.date,
    t.recurring ? 'Yes' : 'No'
  ]);

  const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
  
  const link = document.createElement('a');
  link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  link.download = filename;
  link.click();
};

/**
 * Calculate days difference between two dates
 * @param {string} startDate - Start date ISO string
 * @param {string} endDate - End date ISO string
 * @returns {number} Number of days
 */
export const daysDifference = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.floor((end - start) / (1000 * 60 * 60 * 24));
};

/**
 * Get current month date range
 * @returns {object} Object with startDate and endDate
 */
export const getCurrentMonthRange = () => {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0]
  };
};

/**
 * Get last 7 days date range
 * @returns {object} Object with startDate and endDate
 */
export const getLast7DaysRange = () => {
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0]
  };
};
