import React, { useState } from 'react';
import '../styles/AuthForm.css';

const AuthForm = ({ onLogin, loading }) => {
  const [credentials, setCredentials] = useState({
    username: 'student',
    password: '123456'
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!credentials.username) newErrors.username = 'Username is required';
    if (!credentials.password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await onLogin(credentials);
  };

  return (
    <div className="auth-form">
      <div className="auth-container">
        <h2>💳 Finance Tracker Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              disabled={loading}
              className={errors.username ? 'input-error' : ''}
            />
            {errors.username && <span className="error-text">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              disabled={loading}
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? '⏳ Logging in...' : '🔓 Login'}
          </button>

          <p className="demo-info">
            Demo credentials:<br />
            Username: <strong>student</strong><br />
            Password: <strong>123456</strong>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
