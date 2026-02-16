import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../utils';
import '../styles/MonthlyTrends.css';

const MonthlyTrends = ({ trendData, loading }) => {
  if (loading) {
    return <div className="chart-loading">Loading trends...</div>;
  }

  if (!trendData || Object.keys(trendData).length === 0) {
    return (
      <div className="empty-state">
        <p>📉 No trend data available</p>
      </div>
    );
  }

  // Convert to chart format
  const data = Object.entries(trendData).map(([month, values]) => ({
    month,
    income: values.income || 0,
    expense: values.expense || 0,
    balance: (values.income || 0) - (values.expense || 0)
  }));

  return (
    <div className="monthly-trends">
      <h3>📈 Monthly Trends</h3>
      
      {/* Bar Chart showing Income vs Expenses */}
      <div className="chart-container">
        <h4>Income vs Expenses</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              formatter={(value) => formatCurrency(value)}
              contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}
            />
            <Legend />
            <Bar dataKey="income" fill="#84fab0" name="Income" />
            <Bar dataKey="expense" fill="#fa709a" name="Expenses" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart showing Balance Trend */}
      <div className="chart-container">
        <h4>Balance Trend</h4>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              formatter={(value) => formatCurrency(value)}
              contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}
            />
            <Legend />
            <Line type="monotone" dataKey="balance" stroke="#667eea" strokeWidth={2} name="Balance" dot={{ fill: '#667eea' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Table */}
      <div className="trends-summary">
        <table className="summary-table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Income</th>
              <th>Expenses</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                <td><strong>{row.month}</strong></td>
                <td className="income-text">{formatCurrency(row.income)}</td>
                <td className="expense-text">{formatCurrency(row.expense)}</td>
                <td className={row.balance >= 0 ? 'positive-text' : 'negative-text'}>
                  {formatCurrency(row.balance)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MonthlyTrends;
