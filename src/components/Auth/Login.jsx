import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDemoCredentials, setShowDemoCredentials] = useState(false);
  
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = login(username, password);
    
    if (!result.success) {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const handleDemoLogin = (role) => {
    const demoCredentials = {
      admin: { username: 'admin', password: 'admin123' },
      faculty: { username: 'faculty', password: 'faculty123' },
      student: { username: 'student', password: 'student123' }
    };
    
    setUsername(demoCredentials[role].username);
    setPassword(demoCredentials[role].password);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">EduTrack</h1>
          <p className="login-subtitle">Student Management System</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your username"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary login-btn"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        <div className="demo-section">
          <button 
            type="button"
            className="demo-toggle-btn"
            onClick={() => setShowDemoCredentials(!showDemoCredentials)}
          >
            {showDemoCredentials ? 'Hide Demo Credentials' : 'Show Demo Credentials'}
          </button>
          
          {showDemoCredentials && (
            <div className="demo-credentials">
              <h4>Demo Login Credentials:</h4>
              <div className="demo-roles">
                <div className="demo-role">
                  <h5>Admin Access</h5>
                  <p>Username: admin</p>
                  <p>Password: admin123</p>
                  <button 
                    type="button" 
                    className="btn btn-secondary btn-small"
                    onClick={() => handleDemoLogin('admin')}
                  >
                    Use Admin Credentials
                  </button>
                </div>
                
                <div className="demo-role">
                  <h5>Faculty Access</h5>
                  <p>Username: faculty</p>
                  <p>Password: faculty123</p>
                  <button 
                    type="button" 
                    className="btn btn-secondary btn-small"
                    onClick={() => handleDemoLogin('faculty')}
                  >
                    Use Faculty Credentials
                  </button>
                </div>
                
                <div className="demo-role">
                  <h5>Student Access</h5>
                  <p>Username: student</p>
                  <p>Password: student123</p>
                  <button 
                    type="button" 
                    className="btn btn-secondary btn-small"
                    onClick={() => handleDemoLogin('student')}
                  >
                    Use Student Credentials
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
