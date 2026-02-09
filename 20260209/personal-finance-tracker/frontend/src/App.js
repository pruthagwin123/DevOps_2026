import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Dashboard from './Dashboard';
import AuthForm from './components/AuthForm';
import DarkModeToggle from './components/DarkModeToggle';
import { getApiBaseUrl } from './utils';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const apiBaseUrl = getApiBaseUrl();

  // Check for saved authentication
  useEffect(() => {
    const savedUser = localStorage.getItem('financeUser');
    const savedToken = localStorage.getItem('financeToken');
    
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // Load dark mode preference
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.body.classList.add('dark-mode');
    }
  }, []);

  /**
   * Handle user login
   */
  const handleLogin = async (credentials) => {
    try {
      setAuthLoading(true);
      const response = await axios.post(`${apiBaseUrl}/api/auth/login`, credentials);
      
      // Save user data and token
      setUser(response.data);
      setIsAuthenticated(true);
      localStorage.setItem('financeUser', JSON.stringify(response.data));
      localStorage.setItem('financeToken', response.data.token);
      
      alert(`✅ Welcome, ${response.data.name}!`);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      alert('❌ ' + errorMsg);
    } finally {
      setAuthLoading(false);
    }
  };

  /**
   * Handle user logout
   */
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('financeUser');
      localStorage.removeItem('financeToken');
      alert('✅ Logged out successfully!');
    }
  };

  /**
   * Toggle dark mode
   */
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
    
    if (newMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <AuthForm onLogin={handleLogin} loading={authLoading} />;
  }

  // Show main application if authenticated
  return (
    <div className="App">
      {/* Header Section */}
      <header className="app-header">
        <div className="app-header-content">
          <div>
            <h1 className="app-title">💰 Personal Finance Tracker</h1>
            <p className="app-subtitle">Track your income and expenses smartly</p>
          </div>
          <div className="header-actions">
            <div className="header-info">
              <div>{formattedDate}</div>
              {user && <div>Welcome, <strong>{user.name}</strong></div>}
            </div>
            <div className="header-buttons">
              <DarkModeToggle isDarkMode={isDarkMode} onToggle={toggleDarkMode} />
              <button className="logout-btn" onClick={handleLogout}>
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        <Dashboard />
      </main>
    </div>
  );
};

export default App;