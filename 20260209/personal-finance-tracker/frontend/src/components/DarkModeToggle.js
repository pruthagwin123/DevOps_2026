import React from 'react';
import '../styles/DarkModeToggle.css';

const DarkModeToggle = ({ isDarkMode, onToggle }) => {
  return (
    <button className="dark-mode-toggle" onClick={onToggle} title="Toggle dark mode">
      {isDarkMode ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
};

export default DarkModeToggle;
