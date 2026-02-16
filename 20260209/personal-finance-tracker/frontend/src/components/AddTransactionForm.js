import React, { useState } from 'react';
import { getAllCategories } from '../utils';
import '../styles/AddTransactionForm.css';

const AddTransactionForm = ({ onAdd, loading }) => {
  const [formData, setFormData] = useState({
    type: 'expense',
    category: 'Food',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    recurring: false
  });

  const [errors, setErrors] = useState({});

  const categories = getAllCategories();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    await onAdd(formData);
    setFormData({
      type: 'expense',
      category: 'Food',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      recurring: false
    });
  };

  return (
    <div className="add-transaction-form">
      <h3>➕ Add New Transaction</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Type *</label>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="income">📈 Income</option>
              <option value="expense">📉 Expense</option>
            </select>
          </div>
          <div className="form-group">
            <label>Category *</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Amount * {errors.amount && <span className="error-text">- {errors.amount}</span>}</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className={errors.amount ? 'input-error' : ''}
            />
          </div>
          <div className="form-group">
            <label>Date *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Description * {errors.description && <span className="error-text">- {errors.description}</span>}</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description"
            className={errors.description ? 'input-error' : ''}
          />
        </div>

        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              name="recurring"
              checked={formData.recurring}
              onChange={handleChange}
            />
            <span>Recurring transaction?</span>
          </label>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? '⏳ Adding...' : '✅ Add Transaction'}
        </button>
      </form>
    </div>
  );
};

export default AddTransactionForm;
