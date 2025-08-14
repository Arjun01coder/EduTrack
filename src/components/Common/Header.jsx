import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { NotificationBell } from './NotificationSystem';
import { ThemeToggle } from '../../context/ThemeContext';

const Header = () => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <h2>EduTrack</h2>
          <span className="logo-subtitle">Student Management System</span>
        </div>
        
        <div className="header-actions">
          <ThemeToggle />
          <NotificationBell />
          
          <div className="user-info">
            <div 
              className="user-avatar"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <img 
                src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=667eea&color=fff`}
                alt={user?.name}
                className="avatar-image"
              />
              <div className="user-details">
                <span className="user-name">{user?.name}</span>
                <span className="user-role">{user?.role?.toUpperCase()}</span>
              </div>
              <span className="dropdown-arrow">▼</span>
            </div>

            {showUserMenu && (
              <div className="user-dropdown">
                <div className="dropdown-item">
                  <span className="dropdown-icon">👤</span>
                  Profile Settings
                </div>
                <div className="dropdown-item">
                  <span className="dropdown-icon">🔔</span>
                  Notification Settings
                </div>
                <div className="dropdown-item">
                  <span className="dropdown-icon">📊</span>
                  Dashboard Analytics
                </div>
                <div className="dropdown-item">
                  <span className="dropdown-icon">🆘</span>
                  Help & Support
                </div>
                <div className="dropdown-divider"></div>
                <div className="dropdown-item logout" onClick={handleLogout}>
                  <span className="dropdown-icon">🚪</span>
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 0 30px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 0;
          max-width: 1400px;
          margin: 0 auto;
        }

        .logo h2 {
          margin: 0;
          font-size: 28px;
          font-weight: 700;
          background: linear-gradient(45deg, #fff, #f0f8ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .logo-subtitle {
          display: block;
          font-size: 12px;
          opacity: 0.9;
          margin-top: -5px;
          font-weight: 300;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .user-info {
          position: relative;
        }

        .user-avatar {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          padding: 8px 16px;
          border-radius: 25px;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .user-avatar:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
        }

        .avatar-image {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .user-details {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .user-name {
          font-weight: 600;
          font-size: 14px;
        }

        .user-role {
          font-size: 11px;
          opacity: 0.8;
          background: rgba(255, 255, 255, 0.2);
          padding: 2px 8px;
          border-radius: 10px;
          margin-top: 2px;
        }

        .dropdown-arrow {
          font-size: 10px;
          transition: transform 0.3s ease;
        }

        .user-avatar:hover .dropdown-arrow {
          transform: rotate(180deg);
        }

        .user-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          min-width: 220px;
          padding: 8px 0;
          margin-top: 8px;
          border: 1px solid #e0e0e0;
          animation: slideDown 0.3s ease;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          color: #333;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
        }

        .dropdown-item:hover {
          background: #f8f9fa;
        }

        .dropdown-item.logout {
          color: #dc3545;
        }

        .dropdown-item.logout:hover {
          background: #fff5f5;
        }

        .dropdown-icon {
          font-size: 16px;
        }

        .dropdown-divider {
          height: 1px;
          background: #eee;
          margin: 8px 0;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .header {
            padding: 0 20px;
          }

          .header-content {
            padding: 12px 0;
          }

          .logo h2 {
            font-size: 24px;
          }

          .logo-subtitle {
            font-size: 10px;
          }

          .header-actions {
            gap: 10px;
          }

          .user-details {
            display: none;
          }

          .user-avatar {
            padding: 8px;
            gap: 0;
          }

          .dropdown-arrow {
            display: none;
          }

          .user-dropdown {
            right: -10px;
            min-width: 200px;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
