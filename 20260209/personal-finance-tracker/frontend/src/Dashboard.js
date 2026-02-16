import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatCurrency, getApiBaseUrl, getBalanceStatus } from './utils';
import './Dashboard.css';

// Import all new components
import TransactionList from './components/TransactionList';
import ExpenseChart from './components/ExpenseChart';
import AddTransactionForm from './components/AddTransactionForm';
import DateRangeFilter from './components/DateRangeFilter';
import SearchTransactions from './components/SearchTransactions';
import BudgetAlert from './components/BudgetAlert';
import MonthlyTrends from './components/MonthlyTrends';
import ExportData from './components/ExportData';

const Dashboard = () => {
  // State Management
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // Transactions State
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  
  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  
  // Category & Trends State
  const [categoryBreakdown, setCategoryBreakdown] = useState({});
  const [trendData, setTrendData] = useState({});
  
  // Loading states for different sections
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [addingTransaction, setAddingTransaction] = useState(false);

  const apiBaseUrl = getApiBaseUrl();

  /**
   * Fetch dashboard summary data
   */
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${apiBaseUrl}/api/dashboard`, {
        timeout: 5000
      });
      
      setData(response.data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch all transactions with filters
   */
  const fetchTransactions = async () => {
    try {
      setTransactionsLoading(true);
      
      const params = new URLSearchParams();
      if (dateRange.startDate) params.append('startDate', dateRange.startDate);
      if (dateRange.endDate) params.append('endDate', dateRange.endDate);
      if (searchQuery) params.append('search', searchQuery);
      
      const response = await axios.get(`${apiBaseUrl}/api/transactions?${params}`);
      setTransactions(response.data);
      setFilteredTransactions(response.data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setTransactionsLoading(false);
    }
  };

  /**
   * Fetch category breakdown
   */
  const fetchCategoryBreakdown = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/categories`);
      setCategoryBreakdown(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  /**
   * Fetch monthly trends
   */
  const fetchMonthlyTrends = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/trends`);
      setTrendData(response.data);
    } catch (err) {
      console.error('Error fetching trends:', err);
    }
  };

  /**
   * Handle errors with detailed messages
   */
  const handleError = (err) => {
    let errorMessage = 'Unable to fetch data';
    if (err.code === 'ECONNABORTED') {
      errorMessage = 'Request timeout. Backend might be offline.';
    } else if (err.response?.status === 404) {
      errorMessage = 'API endpoint not found (404).';
    } else if (err.response?.status === 500) {
      errorMessage = 'Server error (500). Please try again later.';
    } else if (err.code === 'ERR_NETWORK' || !err.response) {
      errorMessage = 'Network error. Check if backend is running on port 5000.';
    } else {
      errorMessage = err.message || 'Failed to fetch data from backend.';
    }
    setError(errorMessage);
    console.error('API Error:', err);
  };

  /**
   * Add new transaction
   */
  const handleAddTransaction = async (formData) => {
    try {
      setAddingTransaction(true);
      await axios.post(`${apiBaseUrl}/api/transactions`, formData);
      
      // Refresh all data
      await Promise.all([
        fetchDashboardData(),
        fetchTransactions(),
        fetchCategoryBreakdown(),
        fetchMonthlyTrends()
      ]);
      
      alert('✅ Transaction added successfully!');
    } catch (err) {
      alert('❌ Failed to add transaction: ' + (err.response?.data?.message || err.message));
    } finally {
      setAddingTransaction(false);
    }
  };

  /**
   * Delete transaction
   */
  const handleDeleteTransaction = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }
    
    try {
      await axios.delete(`${apiBaseUrl}/api/transactions/${id}`);
      
      // Refresh all data
      await Promise.all([
        fetchDashboardData(),
        fetchTransactions(),
        fetchCategoryBreakdown(),
        fetchMonthlyTrends()
      ]);
      
      alert('✅ Transaction deleted successfully!');
    } catch (err) {
      alert('❌ Failed to delete transaction: ' + (err.response?.data?.message || err.message));
    }
  };

  /**
   * Handle date range filter change
   */
  const handleDateRangeChange = (newRange) => {
    setDateRange(newRange);
  };

  /**
   * Handle search query change
   */
  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  /**
   * Refresh all data
   */
  const handleRefresh = async () => {
    await Promise.all([
      fetchDashboardData(),
      fetchTransactions(),
      fetchCategoryBreakdown(),
      fetchMonthlyTrends()
    ]);
  };

  /**
   * Initial data fetch on mount
   */
  useEffect(() => {
    fetchDashboardData();
    fetchTransactions();
    fetchCategoryBreakdown();
    fetchMonthlyTrends();
  }, []);

  /**
   * Re-fetch transactions when filters change
   */
  useEffect(() => {
    fetchTransactions();
  }, [dateRange, searchQuery]);

  // Loading State
  if (loading && !data) {
    return (
      <div className="dashboard">
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Error State (only if no data available)
  if (error && !data) {
    return (
      <div className="dashboard">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <p className="error-message">{error}</p>
          <button onClick={handleRefresh} className="retry-button">
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  // Calculate balance
  const balance = data ? data.totalIncome - data.totalExpenses : 0;
  const balanceStatus = getBalanceStatus(balance);

  // Main Dashboard Render
  return (
    <div className="dashboard">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <h1>💰 Financial Dashboard</h1>
        <button
          onClick={handleRefresh}
          className="refresh-button"
          disabled={loading}
        >
          <span className={loading ? 'spin' : ''}>🔄</span>
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Error Banner (if exists but data is available) */}
      {error && data && (
        <div className="error-banner">
          ⚠️ {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card income-card">
          <div className="stat-icon">📈</div>
          <h2>Total Income</h2>
          <p className="stat-value">{formatCurrency(data.totalIncome)}</p>
        </div>

        <div className="stat-card expense-card">
          <div className="stat-icon">📉</div>
          <h2>Total Expenses</h2>
          <p className="stat-value">{formatCurrency(data.totalExpenses)}</p>
        </div>

        <div className={`stat-card balance-card ${balanceStatus.className}`}>
          <div className="stat-icon">⚖️</div>
          <h2>Balance</h2>
          <p className="stat-value" style={{ color: balanceStatus.color }}>
            {formatCurrency(balance)}
          </p>
          <p className="balance-status">{balanceStatus.status}</p>
        </div>
      </div>

      {/* Budget Alert */}
      {data && data.budget && (
        <BudgetAlert totalExpenses={data.totalExpenses} budget={data.budget} />
      )}

      {/* Add Transaction Form */}
      <AddTransactionForm onAdd={handleAddTransaction} loading={addingTransaction} />

      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-grid">
          <DateRangeFilter onFilterChange={handleDateRangeChange} loading={transactionsLoading} />
          <SearchTransactions onSearch={handleSearchChange} loading={transactionsLoading} />
        </div>
      </div>

      {/* Export Button */}
      <ExportData transactions={transactions} loading={transactionsLoading} />

      {/* Transaction List */}
      <TransactionList
        transactions={filteredTransactions}
        onDelete={handleDeleteTransaction}
        loading={transactionsLoading}
      />

      {/* Expense Breakdown Chart */}
      <ExpenseChart categoryBreakdown={categoryBreakdown} loading={false} />

      {/* Monthly Trends */}
      <MonthlyTrends trendData={trendData} loading={false} />

      {/* Footer with Last Updated */}
      <div className="dashboard-footer">
        <p>Last updated: {lastUpdated}</p>
      </div>
    </div>
  );
};

export default Dashboard;