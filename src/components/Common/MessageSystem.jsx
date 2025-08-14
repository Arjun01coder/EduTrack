import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Modal from '../Common/Modal';

const MessageSystem = () => {
  const { user } = useAuth();
  const { students, faculty } = useData();
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: 'Admin',
      to: 'All Students',
      subject: 'Welcome to New Semester',
      content: 'Welcome back to school! We hope you have a great semester ahead.',
      timestamp: new Date(Date.now() - 86400000),
      read: false,
      priority: 'high',
      type: 'announcement'
    },
    {
      id: 2,
      from: 'Faculty',
      to: 'STU001',
      subject: 'Assignment Reminder',
      content: 'Please submit your pending assignment by tomorrow.',
      timestamp: new Date(Date.now() - 3600000),
      read: true,
      priority: 'medium',
      type: 'individual'
    }
  ]);

  const [activeTab, setActiveTab] = useState('inbox');
  const [showCompose, setShowCompose] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [composeData, setComposeData] = useState({
    to: '',
    subject: '',
    content: '',
    priority: 'medium',
    type: 'individual'
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');

  const getFilteredMessages = () => {
    let filtered = messages.filter(msg => {
      const isInbox = activeTab === 'inbox' && (msg.to === user?.name || msg.to === 'All Students' || msg.to === 'All Faculty');
      const isSent = activeTab === 'sent' && msg.from === user?.name;
      
      return isInbox || isSent;
    });

    if (searchTerm) {
      filtered = filtered.filter(msg => 
        msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.from.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterPriority !== 'all') {
      filtered = filtered.filter(msg => msg.priority === filterPriority);
    }

    return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    const newMessage = {
      id: Date.now(),
      from: user?.name,
      to: composeData.to,
      subject: composeData.subject,
      content: composeData.content,
      timestamp: new Date(),
      read: false,
      priority: composeData.priority,
      type: composeData.type
    };

    setMessages(prev => [newMessage, ...prev]);
    setShowCompose(false);
    setComposeData({
      to: '',
      subject: '',
      content: '',
      priority: 'medium',
      type: 'individual'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setComposeData(prev => ({ ...prev, [name]: value }));
  };

  const markAsRead = (messageId) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, read: true } : msg
      )
    );
  };

  const deleteMessage = (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null);
      }
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'announcement': return '📢';
      case 'individual': return '💬';
      case 'group': return '👥';
      default: return '📧';
    }
  };

  const getUnreadCount = () => {
    return messages.filter(msg => 
      !msg.read && (msg.to === user?.name || msg.to === 'All Students' || msg.to === 'All Faculty')
    ).length;
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const filteredMessages = getFilteredMessages();

  return (
    <div className="message-system">
      <div className="message-header">
        <h2>Messages & Communications</h2>
        <button 
          onClick={() => setShowCompose(true)}
          className="btn btn-primary"
        >
          ✉️ Compose Message
        </button>
      </div>

      <div className="message-container">
        {/* Sidebar */}
        <div className="message-sidebar">
          <div className="message-tabs">
            <button 
              onClick={() => setActiveTab('inbox')}
              className={`tab-btn ${activeTab === 'inbox' ? 'active' : ''}`}
            >
              📥 Inbox
              {getUnreadCount() > 0 && (
                <span className="unread-badge">{getUnreadCount()}</span>
              )}
            </button>
            <button 
              onClick={() => setActiveTab('sent')}
              className={`tab-btn ${activeTab === 'sent' ? 'active' : ''}`}
            >
              📤 Sent
            </button>
          </div>

          <div className="message-filters">
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>

          <div className="message-stats">
            <div className="stat-item">
              <span className="stat-number">{filteredMessages.length}</span>
              <span className="stat-label">Messages</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{getUnreadCount()}</span>
              <span className="stat-label">Unread</span>
            </div>
          </div>
        </div>

        {/* Message List */}
        <div className="message-list">
          {filteredMessages.length === 0 ? (
            <div className="empty-messages">
              <div className="empty-icon">📭</div>
              <h3>No messages found</h3>
              <p>Your {activeTab} is empty or no messages match your search.</p>
            </div>
          ) : (
            filteredMessages.map(message => (
              <div 
                key={message.id}
                className={`message-item ${!message.read ? 'unread' : ''} ${selectedMessage?.id === message.id ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedMessage(message);
                  if (!message.read) markAsRead(message.id);
                }}
              >
                <div className="message-header-row">
                  <div className="message-meta">
                    <span className="message-type">{getTypeIcon(message.type)}</span>
                    <span className="message-priority">{getPriorityIcon(message.priority)}</span>
                    <span className="message-from">
                      {activeTab === 'inbox' ? `From: ${message.from}` : `To: ${message.to}`}
                    </span>
                  </div>
                  <div className="message-time">{formatTimestamp(message.timestamp)}</div>
                </div>
                
                <div className="message-subject">{message.subject}</div>
                <div className="message-preview">
                  {message.content.substring(0, 100)}
                  {message.content.length > 100 && '...'}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Detail */}
        <div className="message-detail">
          {selectedMessage ? (
            <div className="message-content">
              <div className="message-detail-header">
                <div className="message-title">
                  <h3>{selectedMessage.subject}</h3>
                  <div className="message-badges">
                    <span className={`priority-badge ${selectedMessage.priority}`}>
                      {getPriorityIcon(selectedMessage.priority)} {selectedMessage.priority.toUpperCase()}
                    </span>
                    <span className="type-badge">
                      {getTypeIcon(selectedMessage.type)} {selectedMessage.type.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div className="message-actions">
                  <button 
                    onClick={() => deleteMessage(selectedMessage.id)}
                    className="btn btn-danger btn-small"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>

              <div className="message-info">
                <div className="info-row">
                  <strong>From:</strong> {selectedMessage.from}
                </div>
                <div className="info-row">
                  <strong>To:</strong> {selectedMessage.to}
                </div>
                <div className="info-row">
                  <strong>Date:</strong> {new Date(selectedMessage.timestamp).toLocaleString()}
                </div>
              </div>

              <div className="message-body">
                {selectedMessage.content}
              </div>

              <div className="message-reply">
                <button className="btn btn-secondary">
                  ↩️ Reply
                </button>
                <button className="btn btn-secondary">
                  ↪️ Forward
                </button>
              </div>
            </div>
          ) : (
            <div className="no-message-selected">
              <div className="placeholder-icon">📧</div>
              <h3>Select a message</h3>
              <p>Choose a message from the list to view its contents.</p>
            </div>
          )}
        </div>
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <Modal
          title="Compose New Message"
          onClose={() => setShowCompose(false)}
          size="large"
        >
          <form onSubmit={handleSendMessage}>
            <div className="compose-form">
              <div className="form-group">
                <label>To *</label>
                <select
                  name="to"
                  value={composeData.to}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                >
                  <option value="">Select Recipient</option>
                  <option value="All Students">All Students</option>
                  <option value="All Faculty">All Faculty</option>
                  <optgroup label="Students">
                    {students.map(student => (
                      <option key={student.id} value={student.studentId}>
                        {student.name} ({student.studentId})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Faculty">
                    {faculty.map(member => (
                      <option key={member.id} value={member.facultyId}>
                        {member.name} ({member.facultyId})
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Priority</label>
                  <select
                    name="priority"
                    value={composeData.priority}
                    onChange={handleInputChange}
                    className="form-control"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Type</label>
                  <select
                    name="type"
                    value={composeData.type}
                    onChange={handleInputChange}
                    className="form-control"
                  >
                    <option value="individual">Individual Message</option>
                    <option value="announcement">Announcement</option>
                    <option value="group">Group Message</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Subject *</label>
                <input
                  type="text"
                  name="subject"
                  value={composeData.subject}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter message subject"
                  required
                />
              </div>

              <div className="form-group">
                <label>Message *</label>
                <textarea
                  name="content"
                  value={composeData.content}
                  onChange={handleInputChange}
                  className="form-control"
                  rows="8"
                  placeholder="Enter your message content..."
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" onClick={() => setShowCompose(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                📧 Send Message
              </button>
            </div>
          </form>
        </Modal>
      )}

      <style jsx>{`
        .message-system {
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .message-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .message-header h2 {
          margin: 0;
          color: #333;
          font-size: 28px;
          font-weight: 700;
        }

        .message-container {
          display: grid;
          grid-template-columns: 280px 1fr 400px;
          gap: 20px;
          height: 600px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          overflow: hidden;
        }

        .message-sidebar {
          background: #f8f9fa;
          padding: 20px;
          border-right: 1px solid #eee;
        }

        .message-tabs {
          margin-bottom: 20px;
        }

        .tab-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 12px 16px;
          margin-bottom: 8px;
          background: none;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
          color: #666;
        }

        .tab-btn:hover {
          background: #e9ecef;
        }

        .tab-btn.active {
          background: #667eea;
          color: white;
        }

        .unread-badge {
          background: #dc3545;
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: bold;
        }

        .message-filters {
          margin-bottom: 20px;
        }

        .search-input,
        .filter-select {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
          margin-bottom: 10px;
          font-size: 14px;
        }

        .message-stats {
          display: flex;
          gap: 15px;
        }

        .stat-item {
          text-align: center;
          flex: 1;
        }

        .stat-number {
          display: block;
          font-size: 20px;
          font-weight: bold;
          color: #333;
        }

        .stat-label {
          font-size: 12px;
          color: #666;
        }

        .message-list {
          overflow-y: auto;
          padding: 20px;
        }

        .empty-messages {
          text-align: center;
          padding: 60px 20px;
          color: #666;
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 20px;
          opacity: 0.5;
        }

        .message-item {
          padding: 16px;
          border-bottom: 1px solid #f0f0f0;
          cursor: pointer;
          transition: all 0.2s ease;
          border-radius: 8px;
          margin-bottom: 8px;
        }

        .message-item:hover {
          background: #f8f9fa;
        }

        .message-item.unread {
          background: #f0f8ff;
          border-left: 4px solid #667eea;
        }

        .message-item.selected {
          background: #e6f3ff;
          border: 2px solid #667eea;
        }

        .message-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .message-meta {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .message-from {
          font-size: 12px;
          color: #666;
        }

        .message-time {
          font-size: 12px;
          color: #999;
        }

        .message-subject {
          font-weight: 600;
          color: #333;
          margin-bottom: 4px;
          font-size: 14px;
        }

        .message-preview {
          color: #666;
          font-size: 13px;
          line-height: 1.4;
        }

        .message-detail {
          background: #ffffff;
          padding: 20px;
          border-left: 1px solid #eee;
          overflow-y: auto;
        }

        .no-message-selected {
          text-align: center;
          padding: 60px 20px;
          color: #666;
        }

        .placeholder-icon {
          font-size: 48px;
          margin-bottom: 20px;
          opacity: 0.5;
        }

        .message-content {
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .message-detail-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid #eee;
        }

        .message-title h3 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 20px;
        }

        .message-badges {
          display: flex;
          gap: 8px;
        }

        .priority-badge,
        .type-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: bold;
          text-transform: uppercase;
        }

        .priority-badge.high {
          background: #ffe6e6;
          color: #dc3545;
        }

        .priority-badge.medium {
          background: #fff3cd;
          color: #856404;
        }

        .priority-badge.low {
          background: #d4edda;
          color: #155724;
        }

        .type-badge {
          background: #e2e6ea;
          color: #495057;
        }

        .message-info {
          margin-bottom: 20px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .info-row {
          margin-bottom: 8px;
          font-size: 14px;
        }

        .info-row:last-child {
          margin-bottom: 0;
        }

        .message-body {
          flex: 1;
          font-size: 14px;
          line-height: 1.6;
          color: #333;
          margin-bottom: 20px;
          white-space: pre-wrap;
        }

        .message-reply {
          display: flex;
          gap: 10px;
          padding-top: 15px;
          border-top: 1px solid #eee;
        }

        .compose-form {
          margin-bottom: 20px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #333;
        }

        .form-control {
          width: 100%;
          padding: 12px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.3s ease;
        }

        .form-control:focus {
          outline: none;
          border-color: #667eea;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 15px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }

        @media (max-width: 768px) {
          .message-container {
            grid-template-columns: 1fr;
            height: auto;
          }

          .message-sidebar {
            border-right: none;
            border-bottom: 1px solid #eee;
          }

          .message-stats {
            justify-content: center;
          }

          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default MessageSystem;
