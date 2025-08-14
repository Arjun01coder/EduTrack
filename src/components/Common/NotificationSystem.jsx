import React, { useState, useEffect, createContext, useContext } from 'react';

// Notification Context
const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

// Notification Provider
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'info',
      title: 'System Update',
      message: 'New features have been added to the student portal.',
      timestamp: new Date(),
      read: false,
      priority: 'medium'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Fee Due Reminder',
      message: 'Fee payment deadline is approaching for Semester 1.',
      timestamp: new Date(Date.now() - 3600000),
      read: false,
      priority: 'high'
    },
    {
      id: 3,
      type: 'success',
      title: 'Grades Published',
      message: 'Mid-term examination results are now available.',
      timestamp: new Date(Date.now() - 7200000),
      read: true,
      priority: 'medium'
    }
  ]);

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date(),
      read: false,
      priority: 'medium',
      ...notification
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getUnreadCount = () => {
    return notifications.filter(notif => !notif.read).length;
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      getUnreadCount
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Notification Bell Component
export const NotificationBell = () => {
  const { notifications, getUnreadCount, markAsRead } = useNotifications();
  const [showDropdown, setShowDropdown] = useState(false);
  const unreadCount = getUnreadCount();

  return (
    <div className="notification-bell">
      <button 
        className="bell-button"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <span className="bell-icon">🔔</span>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {showDropdown && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h4>Notifications</h4>
            <button 
              className="mark-all-read"
              onClick={() => {
                notifications.forEach(notif => !notif.read && markAsRead(notif.id));
              }}
            >
              Mark all read
            </button>
          </div>
          
          <div className="notification-list">
            {notifications.slice(0, 5).map(notification => (
              <div 
                key={notification.id}
                className={`notification-item ${notification.read ? 'read' : 'unread'} ${notification.priority}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="notification-type">
                  {notification.type === 'info' && '💡'}
                  {notification.type === 'warning' && '⚠️'}
                  {notification.type === 'success' && '✅'}
                  {notification.type === 'error' && '❌'}
                </div>
                <div className="notification-content">
                  <div className="notification-title">{notification.title}</div>
                  <div className="notification-message">{notification.message}</div>
                  <div className="notification-time">
                    {formatTimeAgo(notification.timestamp)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="notification-footer">
            <button className="view-all">View All Notifications</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .notification-bell {
          position: relative;
        }

        .bell-button {
          background: none;
          border: none;
          cursor: pointer;
          position: relative;
          padding: 8px;
          border-radius: 50%;
          transition: all 0.2s ease;
        }

        .bell-button:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .bell-icon {
          font-size: 20px;
          display: block;
        }

        .notification-badge {
          position: absolute;
          top: 0;
          right: 0;
          background: #ff4757;
          color: white;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: bold;
        }

        .notification-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          width: 350px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          z-index: 1000;
          border: 1px solid #e0e0e0;
          max-height: 400px;
          overflow: hidden;
        }

        .notification-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          border-bottom: 1px solid #eee;
          background: #f8f9fa;
        }

        .notification-header h4 {
          margin: 0;
          font-size: 16px;
          color: #333;
        }

        .mark-all-read {
          background: none;
          border: none;
          color: #667eea;
          cursor: pointer;
          font-size: 12px;
          text-decoration: underline;
        }

        .notification-list {
          max-height: 300px;
          overflow-y: auto;
        }

        .notification-item {
          display: flex;
          padding: 15px 20px;
          border-bottom: 1px solid #f0f0f0;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .notification-item:hover {
          background: #f8f9fa;
        }

        .notification-item.unread {
          background: #f0f8ff;
          border-left: 3px solid #667eea;
        }

        .notification-item.high {
          border-left-color: #ff4757;
        }

        .notification-type {
          margin-right: 12px;
          font-size: 16px;
        }

        .notification-content {
          flex: 1;
        }

        .notification-title {
          font-weight: 600;
          color: #333;
          margin-bottom: 4px;
          font-size: 14px;
        }

        .notification-message {
          color: #666;
          font-size: 12px;
          margin-bottom: 4px;
          line-height: 1.4;
        }

        .notification-time {
          color: #999;
          font-size: 11px;
        }

        .notification-footer {
          padding: 15px 20px;
          border-top: 1px solid #eee;
          text-align: center;
          background: #f8f9fa;
        }

        .view-all {
          background: none;
          border: none;
          color: #667eea;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .notification-dropdown {
            width: 300px;
            right: -20px;
          }
        }
      `}</style>
    </div>
  );
};

// Helper function to format time ago
const formatTimeAgo = (timestamp) => {
  const now = new Date();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};
