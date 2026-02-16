import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { formatCurrency } from '../utils';
import '../styles/ExpenseChart.css';

const ExpenseChart = ({ categoryBreakdown, loading }) => {
  // Color palette
  const COLORS = ['#84fab0', '#fa709a', '#fee140', '#a8d8ea', '#aa96da', '#fcbad3', '#ffffd2', '#b4f8c8'];

  if (loading) {
    return <div className="chart-loading">Loading chart...</div>;
  }

  if (!categoryBreakdown || Object.keys(categoryBreakdown).length === 0) {
    return (
      <div className="empty-state">
        <p>📊 No expense data available</p>
      </div>
    );
  }

  // Convert to chart format
  const data = Object.entries(categoryBreakdown).map(([name, value]) => ({
    name,
    value
  }));

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="expense-chart">
      <h3>💹 Expense Breakdown by Category</h3>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => formatCurrency(value)}
              contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="chart-summary">
        <p>
          <strong>Total Expenses:</strong> {formatCurrency(total)}
        </p>
        <div className="category-list">
          {data.map((item, idx) => (
            <div key={item.name} className="category-item">
              <span
                className="color-dot"
                style={{ backgroundColor: COLORS[idx % COLORS.length] }}
              ></span>
              <span className="category-name">{item.name}</span>
              <span className="category-amount">{formatCurrency(item.value)}</span>
              <span className="category-percent">
                ({((item.value / total) * 100).toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpenseChart;
