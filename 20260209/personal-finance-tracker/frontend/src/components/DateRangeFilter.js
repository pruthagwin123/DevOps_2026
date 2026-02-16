import React from 'react';
import { getCurrentMonthRange, getLast7DaysRange } from '../utils';
import '../styles/DateRangeFilter.css';

const DateRangeFilter = ({ onFilterChange, loading }) => {
  const handlePreset = (startDate, endDate) => {
    onFilterChange({ startDate, endDate });
  };

  const handleCustomChange = (e) => {
    const { name, value } = e.target;
    const currentRange = {
      startDate: document.querySelector('[name="startDate"]')?.value || '',
      endDate: document.querySelector('[name="endDate"]')?.value || ''
    };
    currentRange[name] = value;
    onFilterChange(currentRange);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="date-range-filter">
      <h3>📅 Filter by Date Range</h3>
      <div className="filter-buttons">
        <button
          className="preset-btn"
          onClick={() => handlePreset(today, today)}
          disabled={loading}
        >
          Today
        </button>
        <button
          className="preset-btn"
          onClick={() => handlePreset(...Object.values(getLast7DaysRange()))}
          disabled={loading}
        >
          Last 7 Days
        </button>
        <button
          className="preset-btn"
          onClick={() => handlePreset(...Object.values(getCurrentMonthRange()))}
          disabled={loading}
        >
          This Month
        </button>
      </div>

      <div className="custom-range">
        <div className="form-group">
          <label>Start Date</label>
          <input
            type="date"
            name="startDate"
            onChange={handleCustomChange}
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>End Date</label>
          <input
            type="date"
            name="endDate"
            onChange={handleCustomChange}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default DateRangeFilter;
