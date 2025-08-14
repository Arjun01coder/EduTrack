import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('edutrack-theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('edutrack-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
      <style jsx global>{`
        :root {
          --primary-color: #667eea;
          --secondary-color: #764ba2;
          --success-color: #28a745;
          --warning-color: #ffc107;
          --danger-color: #dc3545;
          --info-color: #17a2b8;
          --light-color: #f8f9fa;
          --dark-color: #343a40;
          --background-color: #ffffff;
          --surface-color: #ffffff;
          --text-primary: #333333;
          --text-secondary: #666666;
          --border-color: #e0e0e0;
          --shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          --transition: all 0.3s ease;
        }

        [data-theme="dark"] {
          --background-color: #1a1a1a;
          --surface-color: #2d2d2d;
          --text-primary: #ffffff;
          --text-secondary: #cccccc;
          --border-color: #404040;
          --shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
          --primary-color: #7c3aed;
          --secondary-color: #a855f7;
        }

        * {
          transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
        }

        body {
          background-color: var(--background-color);
          color: var(--text-primary);
        }

        .card, .surface {
          background-color: var(--surface-color);
          border-color: var(--border-color);
        }

        .table {
          background-color: var(--surface-color);
          color: var(--text-primary);
        }

        .table th {
          background-color: var(--light-color);
          color: var(--text-primary);
        }

        [data-theme="dark"] .table th {
          background-color: #404040;
        }

        .form-control {
          background-color: var(--surface-color);
          border-color: var(--border-color);
          color: var(--text-primary);
        }

        .form-control:focus {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
        }

        [data-theme="dark"] .form-control:focus {
          box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.2);
        }

        .btn {
          transition: var(--transition);
        }

        .modal {
          background-color: var(--surface-color);
          color: var(--text-primary);
        }

        .modal-overlay {
          backdrop-filter: blur(5px);
        }

        [data-theme="dark"] .modal-overlay {
          background: rgba(0, 0, 0, 0.8);
        }
      `}</style>
    </ThemeContext.Provider>
  );
};

// Theme Toggle Component
export const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button 
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      <span className="theme-icon">
        {isDarkMode ? '☀️' : '🌙'}
      </span>
      <span className="theme-text">
        {isDarkMode ? 'Light' : 'Dark'}
      </span>

      <style jsx>{`
        .theme-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 25px;
          padding: 8px 16px;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
        }

        .theme-toggle:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
        }

        .theme-icon {
          font-size: 16px;
        }

        .theme-text {
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .theme-text {
            display: none;
          }
          
          .theme-toggle {
            padding: 8px 12px;
          }
        }
      `}</style>
    </button>
  );
};
