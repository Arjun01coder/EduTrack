import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Header from '../Common/Header';
import StudentManagement from '../Admin/StudentManagement';
import FacultyManagement from '../Admin/FacultyManagement';
import CourseManagement from '../Admin/CourseManagement';
import FeeManagement from '../Admin/FeeManagement';
import Analytics from '../Admin/Analytics';
import './Dashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth();
  const { students, faculty, courses, fees } = useData();

  const totalStudents = students.length;
  const totalFaculty = faculty.length;
  const totalCourses = courses.length;
  const totalFeesPending = fees.filter(fee => fee.status !== 'Paid').length;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'students', label: 'Students', icon: '👥' },
    { id: 'faculty', label: 'Faculty', icon: '👨‍🏫' },
    { id: 'courses', label: 'Courses', icon: '📚' },
    { id: 'fees', label: 'Fees', icon: '💰' },
    { id: 'analytics', label: 'Analytics', icon: '📈' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="overview-content">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <div className="stat-number">{totalStudents}</div>
                  <div className="stat-label">Total Students</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">👨‍🏫</div>
                <div className="stat-info">
                  <div className="stat-number">{totalFaculty}</div>
                  <div className="stat-label">Faculty Members</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">📚</div>
                <div className="stat-info">
                  <div className="stat-number">{totalCourses}</div>
                  <div className="stat-label">Active Courses</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">⚠️</div>
                <div className="stat-info">
                  <div className="stat-number">{totalFeesPending}</div>
                  <div className="stat-label">Pending Fees</div>
                </div>
              </div>
            </div>

            <div className="recent-activities">
              <div className="card">
                <h3>Recent Activities</h3>
                <div className="activity-list">
                  <div className="activity-item">
                    <div className="activity-icon">✅</div>
                    <div className="activity-content">
                      <div className="activity-text">New student Emma Davis enrolled</div>
                      <div className="activity-time">2 hours ago</div>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon">💰</div>
                    <div className="activity-content">
                      <div className="activity-text">Fee payment received from Mike Wilson</div>
                      <div className="activity-time">5 hours ago</div>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon">📚</div>
                    <div className="activity-content">
                      <div className="activity-text">New course "Web Development" added</div>
                      <div className="activity-time">1 day ago</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'students':
        return <StudentManagement />;
      case 'faculty':
        return <FacultyManagement />;
      case 'courses':
        return <CourseManagement />;
      case 'fees':
        return <FeeManagement />;
      case 'analytics':
        return <Analytics />;
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="dashboard">
      <Header />
      
      <div className="dashboard-content">
        <div className="container">
          <div className="dashboard-header">
            <h1>Admin Dashboard</h1>
            <p>Welcome back, {user.name}!</p>
          </div>
          
          <div className="dashboard-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>
          
          <div className="dashboard-body">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
