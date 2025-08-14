import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Header from '../Common/Header';
import AttendanceManagement from '../Faculty/AttendanceManagement';
import GradeManagement from '../Faculty/GradeManagement';
import './Dashboard.css';

const FacultyDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth();
  const { students, courses, attendance, grades } = useData();

  // Get faculty's courses
  const facultyCourses = courses.filter(course => course.instructor === user.name);
  
  // Get students in faculty's courses
  const facultyStudents = students.filter(student => 
    facultyCourses.some(course => student.class.includes(course.semester))
  );

  // Get recent attendance records
  const recentAttendance = attendance
    .filter(record => record.facultyId === `FAC${user.id.toString().padStart(3, '0')}`)
    .slice(0, 5);

  // Get recent grades
  const recentGrades = grades
    .filter(grade => facultyCourses.some(course => course.courseCode === grade.courseCode))
    .slice(0, 5);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'attendance', label: 'Attendance', icon: '📋' },
    { id: 'grades', label: 'Grades', icon: '📝' },
    { id: 'courses', label: 'My Courses', icon: '📚' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="overview-content">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📚</div>
                <div className="stat-info">
                  <div className="stat-number">{facultyCourses.length}</div>
                  <div className="stat-label">My Courses</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <div className="stat-number">{facultyStudents.length}</div>
                  <div className="stat-label">Students</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">📋</div>
                <div className="stat-info">
                  <div className="stat-number">{recentAttendance.length}</div>
                  <div className="stat-label">Recent Attendance</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">📝</div>
                <div className="stat-info">
                  <div className="stat-number">{recentGrades.length}</div>
                  <div className="stat-label">Recent Grades</div>
                </div>
              </div>
            </div>

            <div className="dashboard-grid">
              <div className="card">
                <h3>My Courses</h3>
                <div className="courses-list">
                  {facultyCourses.map(course => (
                    <div key={course.id} className="course-item">
                      <div className="course-info">
                        <div className="course-name">{course.courseName}</div>
                        <div className="course-code">{course.courseCode}</div>
                      </div>
                      <div className="course-details">
                        <span className="course-credits">{course.credits} Credits</span>
                        <span className="course-semester">{course.semester}</span>
                      </div>
                    </div>
                  ))}
                  {facultyCourses.length === 0 && (
                    <p className="empty-message">No courses assigned yet.</p>
                  )}
                </div>
              </div>

              <div className="card">
                <h3>Recent Activities</h3>
                <div className="activity-list">
                  <div className="activity-item">
                    <div className="activity-icon">📋</div>
                    <div className="activity-content">
                      <div className="activity-text">Attendance marked for Data Structures</div>
                      <div className="activity-time">2 hours ago</div>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon">📝</div>
                    <div className="activity-content">
                      <div className="activity-text">Grades updated for Web Development</div>
                      <div className="activity-time">1 day ago</div>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon">👥</div>
                    <div className="activity-content">
                      <div className="activity-text">New student enrolled in your class</div>
                      <div className="activity-time">2 days ago</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'attendance':
        return <AttendanceManagement />;
      case 'grades':
        return <GradeManagement />;
      case 'courses':
        return (
          <div className="courses-management">
            <h3>Course Details</h3>
            <div className="courses-detailed-list">
              {facultyCourses.map(course => (
                <div key={course.id} className="detailed-course-card">
                  <div className="course-header">
                    <h4>{course.courseName}</h4>
                    <span className="course-code-badge">{course.courseCode}</span>
                  </div>
                  <div className="course-info-grid">
                    <div className="info-item">
                      <span className="info-label">Credits:</span>
                      <span>{course.credits}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Department:</span>
                      <span>{course.department}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Semester:</span>
                      <span>{course.semester}</span>
                    </div>
                  </div>
                  {course.description && (
                    <div className="course-description">
                      <p>{course.description}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
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
            <h1>Faculty Dashboard</h1>
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

      <style jsx>{`
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 30px;
          margin-top: 30px;
        }
        
        .courses-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .course-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
          border-left: 4px solid #667eea;
        }
        
        .course-info {
          flex: 1;
        }
        
        .course-name {
          font-weight: 600;
          color: #333;
          margin-bottom: 5px;
        }
        
        .course-code {
          font-size: 12px;
          color: #666;
          font-family: monospace;
        }
        
        .course-details {
          display: flex;
          flex-direction: column;
          gap: 5px;
          text-align: right;
        }
        
        .course-credits,
        .course-semester {
          font-size: 12px;
          color: #666;
        }
        
        .empty-message {
          text-align: center;
          color: #666;
          font-style: italic;
          padding: 20px;
        }
        
        .courses-detailed-list {
          display: grid;
          gap: 20px;
        }
        
        .detailed-course-card {
          background: white;
          border-radius: 10px;
          padding: 25px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .course-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .course-header h4 {
          margin: 0;
          color: #333;
        }
        
        .course-code-badge {
          background: #667eea;
          color: white;
          padding: 5px 10px;
          border-radius: 5px;
          font-size: 12px;
          font-weight: 500;
        }
        
        .course-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
          margin-bottom: 15px;
        }
        
        .info-item {
          display: flex;
          justify-content: space-between;
          padding: 10px;
          background: #f8f9fa;
          border-radius: 5px;
        }
        
        .info-label {
          font-weight: 500;
          color: #666;
        }
        
        .course-description {
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
          border-left: 4px solid #667eea;
        }
        
        .course-description p {
          margin: 0;
          color: #666;
          line-height: 1.5;
        }
        
        @media (max-width: 768px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
          
          .course-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          
          .course-details {
            text-align: left;
          }
          
          .course-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          
          .course-info-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default FacultyDashboard;
