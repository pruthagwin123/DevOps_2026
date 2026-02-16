import React from 'react';
import { formatCurrency } from '../utils';
import '../styles/BudgetAlert.css';

const BudgetAlert = ({ totalExpenses, budget }) => {
  if (!budget || !totalExpenses) {
    return null;
  }

  const percentage = (totalExpenses / budget) * 100;
  const remaining = budget - totalExpenses;
  const isWarning = percentage >= 75;
  const isCritical = percentage >= 100;

  let status = 'safe';
  let statusText = '✅ Safe';
  let statusColor = '#22c55e';

  if (isCritical) {
    status = 'critical';
    statusText = '🚨 Over Budget!';
    statusColor = '#ef4444';
  } else if (isWarning) {
    status = 'warning';
    statusText = '⚠️ Warning';
    statusColor = '#f59e0b';
  }

  return (
    <div className={`budget-alert ${status}`}>
      <h3>💰 Budget Status</h3>
      <div className="budget-info">
        <div className="budget-item">
          <span>Budget:</span>
          <strong>{formatCurrency(budget)}</strong>
        </div>
        <div className="budget-item">
          <span>Spent:</span>
          <strong>{formatCurrency(totalExpenses)}</strong>
        </div>
        <div className="budget-item">
          <span>Remaining:</span>
          <strong style={{ color: remaining >= 0 ? '#22c55e' : '#ef4444' }}>
            {formatCurrency(remaining)}
          </strong>
        </div>
      </div>

      <div className="budget-bar">
        <div
          className="progress-fill"
          style={{
            width: `${Math.min(percentage, 100)}%`,
            backgroundColor: statusColor
          }}
        ></div>
      </div>

      <div className="budget-status" style={{ color: statusColor }}>
        {statusText} - {percentage.toFixed(1)}% of budget used
      </div>
    </div>
  );
};

export default BudgetAlert;
