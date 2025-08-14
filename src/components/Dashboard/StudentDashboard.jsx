import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Header from '../Common/Header';
import './Dashboard.css';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth();
  const { students, courses, attendance, grades, fees } = useData();

  // Get current student data
  const currentStudent = students.find(student => student.name === user.name) || 
    students.find(student => student.studentId === user.studentId) ||
    students[0]; // Fallback for demo

  const studentId = currentStudent?.studentId || 'STU001';

  // Get student's attendance
  const studentAttendance = attendance.filter(record => record.studentId === studentId);
  
  // Get student's grades
  const studentGrades = grades.filter(grade => grade.studentId === studentId);
  
  // Get student's fees
  const studentFees = fees.filter(fee => fee.studentId === studentId);

  // Calculate attendance percentage
  const calculateAttendancePercentage = () => {
    if (studentAttendance.length === 0) return 0;
    const presentCount = studentAttendance.filter(record => record.status === 'Present').length;
    return ((presentCount / studentAttendance.length) * 100).toFixed(1);
  };

  // Calculate GPA
  const calculateGPA = () => {
    if (studentGrades.length === 0) return '0.00';
    
    const gradePoints = {
      'A+': 4.0, 'A': 4.0, 'B+': 3.5, 'B': 3.0, 'C': 2.5, 'D': 2.0, 'F': 0.0
    };
    
    const totalPoints = studentGrades.reduce((sum, grade) => {
      return sum + (gradePoints[grade.grade] || 0);
    }, 0);
    
    return (totalPoints / studentGrades.length).toFixed(2);
  };

  // Get fee status
  const getFeeStatus = () => {
    const totalAmount = studentFees.reduce((sum, fee) => sum + fee.totalAmount, 0);
    const paidAmount = studentFees.reduce((sum, fee) => sum + fee.paidAmount, 0);
    const pendingAmount = totalAmount - paidAmount;
    
    return { totalAmount, paidAmount, pendingAmount };
  };

  const attendancePercentage = calculateAttendancePercentage();
  const gpa = calculateGPA();
  const feeStatus = getFeeStatus();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'attendance', label: 'Attendance', icon: '📋' },
    { id: 'grades', label: 'Grades', icon: '📝' },
    { id: 'fees', label: 'Fees', icon: '💰' }
  ];

  const getGradeBadgeClass = (grade) => {
    switch (grade) {
      case 'A+':
      case 'A': return 'badge-success';
      case 'B+':
      case 'B': return 'badge-info';
      case 'C': return 'badge-warning';
      case 'D':
      case 'F': return 'badge-danger';
      default: return 'badge-secondary';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="overview-content">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📋</div>
                <div className="stat-info">
                  <div className="stat-number">{attendancePercentage}%</div>
                  <div className="stat-label">Attendance</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">📝</div>
                <div className="stat-info">
                  <div className="stat-number">{gpa}</div>
                  <div className="stat-label">GPA</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-info">
                  <div className="stat-number">₹{feeStatus.paidAmount.toLocaleString()}</div>
                  <div className="stat-label">Fees Paid</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">📚</div>
                <div className="stat-info">
                  <div className="stat-number">{studentGrades.length}</div>
                  <div className="stat-label">Assessments</div>
                </div>
              </div>
            </div>

            <div className="dashboard-grid">
              <div className="card">
                <h3>Recent Grades</h3>
                <div className="grades-list">
                  {studentGrades.slice(0, 5).map(grade => (
                    <div key={grade.id} className="grade-item">
                      <div className="grade-info">
                        <div className="grade-course">{grade.courseName}</div>
                        <div className="grade-exam">{grade.examType}</div>
                      </div>
                      <div className="grade-result">
                        <span className={`badge ${getGradeBadgeClass(grade.grade)}`}>
                          {grade.grade}
                        </span>
                        <div className="grade-marks">{grade.marks}/{grade.totalMarks}</div>
                      </div>
                    </div>
                  ))}
                  {studentGrades.length === 0 && (
                    <p className="empty-message">No grades available yet.</p>
                  )}
                </div>
              </div>

              <div className="card">
                <h3>Fee Status</h3>
                <div className="fee-summary">
                  {studentFees.map(fee => (
                    <div key={fee.id} className="fee-item">
                      <div className="fee-info">
                        <div className="fee-semester">{fee.semester}</div>
                        <div className="fee-amount">₹{fee.totalAmount.toLocaleString()}</div>
                      </div>
                      <div className="fee-status">
                        <span className={`badge ${
                          fee.status === 'Paid' ? 'badge-success' : 
                          fee.status === 'Partial' ? 'badge-warning' : 'badge-danger'
                        }`}>
                          {fee.status}
                        </span>
                        {fee.pendingAmount > 0 && (
                          <div className="pending-amount">
                            Pending: ₹{fee.pendingAmount.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {studentFees.length === 0 && (
                    <p className="empty-message">No fee records available.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'profile':
        return (
          <div className="profile-content">
            <div className="profile-card">
              <div className="profile-header">
                <div className="profile-avatar">
                  <span className="avatar-initials">
                    {currentStudent?.name?.split(' ').map(n => n[0]).join('') || 'ST'}
                  </span>
                </div>
                <div className="profile-info">
                  <h2>{currentStudent?.name || user.name}</h2>
                  <p className="student-id">Student ID: {studentId}</p>
                </div>
              </div>
              
              <div className="profile-details">
                <div className="detail-section">
                  <h3>Personal Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Email:</span>
                      <span>{currentStudent?.email || user.email}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Phone:</span>
                      <span>{currentStudent?.phone || 'Not provided'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Date of Birth:</span>
                      <span>{currentStudent?.dateOfBirth ? new Date(currentStudent.dateOfBirth).toLocaleDateString() : 'Not provided'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Address:</span>
                      <span>{currentStudent?.address || 'Not provided'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h3>Academic Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Class:</span>
                      <span>{currentStudent?.class || 'Not assigned'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Section:</span>
                      <span>{currentStudent?.section || 'Not assigned'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Roll Number:</span>
                      <span>{currentStudent?.rollNumber || 'Not assigned'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Admission Date:</span>
                      <span>{currentStudent?.admissionDate ? new Date(currentStudent.admissionDate).toLocaleDateString() : 'Not provided'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h3>Guardian Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Parent Name:</span>
                      <span>{currentStudent?.parentName || 'Not provided'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Parent Phone:</span>
                      <span>{currentStudent?.parentPhone || 'Not provided'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'attendance':
        return (
          <div className="attendance-content">
            <div className="attendance-summary">
              <div className="summary-card">
                <h3>Attendance Overview</h3>
                <div className="attendance-stats">
                  <div className="attendance-stat">
                    <span className="stat-number">{studentAttendance.length}</span>
                    <span className="stat-label">Total Classes</span>
                  </div>
                  <div className="attendance-stat">
                    <span className="stat-number">
                      {studentAttendance.filter(r => r.status === 'Present').length}
                    </span>
                    <span className="stat-label">Present</span>
                  </div>
                  <div className="attendance-stat">
                    <span className="stat-number">
                      {studentAttendance.filter(r => r.status === 'Absent').length}
                    </span>
                    <span className="stat-label">Absent</span>
                  </div>
                  <div className="attendance-stat">
                    <span className="stat-number">{attendancePercentage}%</span>
                    <span className="stat-label">Percentage</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="attendance-records">
              <h3>Attendance Records</h3>
              <div className="attendance-table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Course</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentAttendance
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map(record => (
                      <tr key={record.id}>
                        <td>{new Date(record.date).toLocaleDateString()}</td>
                        <td>{record.courseName}</td>
                        <td>
                          <span className={`badge ${record.status === 'Present' ? 'badge-success' : 'badge-danger'}`}>
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {studentAttendance.length === 0 && (
                  <div className="empty-state">
                    <p>No attendance records found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
        
      case 'grades':
        return (
          <div className="grades-content">
            <div className="grades-summary">
              <div className="summary-card">
                <h3>Academic Performance</h3>
                <div className="performance-stats">
                  <div className="performance-stat">
                    <span className="stat-number">{gpa}</span>
                    <span className="stat-label">Current GPA</span>
                  </div>
                  <div className="performance-stat">
                    <span className="stat-number">{studentGrades.length}</span>
                    <span className="stat-label">Total Assessments</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grades-records">
              <h3>Grade Records</h3>
              <div className="grades-table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Exam Type</th>
                      <th>Marks</th>
                      <th>Grade</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentGrades
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map(grade => (
                      <tr key={grade.id}>
                        <td>{grade.courseName}</td>
                        <td>{grade.examType}</td>
                        <td>{grade.marks}/{grade.totalMarks}</td>
                        <td>
                          <span className={`badge ${getGradeBadgeClass(grade.grade)}`}>
                            {grade.grade}
                          </span>
                        </td>
                        <td>{grade.date ? new Date(grade.date).toLocaleDateString() : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {studentGrades.length === 0 && (
                  <div className="empty-state">
                    <p>No grade records found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
        
      case 'fees':
        return (
          <div className="fees-content">
            <div className="fees-summary">
              <div className="fee-summary-grid">
                <div className="summary-card">
                  <div className="summary-title">Total Amount</div>
                  <div className="summary-amount">₹{feeStatus.totalAmount.toLocaleString()}</div>
                </div>
                <div className="summary-card paid">
                  <div className="summary-title">Amount Paid</div>
                  <div className="summary-amount">₹{feeStatus.paidAmount.toLocaleString()}</div>
                </div>
                <div className="summary-card pending">
                  <div className="summary-title">Pending Amount</div>
                  <div className="summary-amount">₹{feeStatus.pendingAmount.toLocaleString()}</div>
                </div>
              </div>
            </div>
            
            <div className="fees-records">
              <h3>Fee Records</h3>
              <div className="fees-table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Semester</th>
                      <th>Total Amount</th>
                      <th>Paid Amount</th>
                      <th>Pending</th>
                      <th>Status</th>
                      <th>Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentFees.map(fee => (
                      <tr key={fee.id}>
                        <td>{fee.semester}</td>
                        <td>₹{fee.totalAmount.toLocaleString()}</td>
                        <td>₹{fee.paidAmount.toLocaleString()}</td>
                        <td>₹{fee.pendingAmount.toLocaleString()}</td>
                        <td>
                          <span className={`badge ${
                            fee.status === 'Paid' ? 'badge-success' : 
                            fee.status === 'Partial' ? 'badge-warning' : 'badge-danger'
                          }`}>
                            {fee.status}
                          </span>
                        </td>
                        <td>{fee.dueDate ? new Date(fee.dueDate).toLocaleDateString() : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {studentFees.length === 0 && (
                  <div className="empty-state">
                    <p>No fee records found.</p>
                  </div>
                )}
              </div>
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
            <h1>Student Dashboard</h1>
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
        
        .grades-list,
        .fee-summary {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .grade-item,
        .fee-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
          border-left: 4px solid #667eea;
        }
        
        .grade-info,
        .fee-info {
          flex: 1;
        }
        
        .grade-course,
        .fee-semester {
          font-weight: 600;
          color: #333;
          margin-bottom: 5px;
        }
        
        .grade-exam {
          font-size: 12px;
          color: #666;
        }
        
        .fee-amount {
          font-size: 14px;
          color: #666;
          font-weight: 500;
        }
        
        .grade-result,
        .fee-status {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 5px;
        }
        
        .grade-marks {
          font-size: 12px;
          color: #666;
        }
        
        .pending-amount {
          font-size: 12px;
          color: #dc3545;
          font-weight: 500;
        }
        
        .empty-message {
          text-align: center;
          color: #666;
          font-style: italic;
          padding: 20px;
        }
        
        /* Profile Styles */
        .profile-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .profile-header {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 30px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }
        
        .profile-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #667eea;
          font-size: 24px;
          font-weight: bold;
        }
        
        .profile-info h2 {
          margin: 0 0 5px 0;
          color: white;
        }
        
        .student-id {
          opacity: 0.9;
          margin: 0;
        }
        
        .profile-details {
          padding: 30px;
        }
        
        .detail-section {
          margin-bottom: 30px;
        }
        
        .detail-section:last-child {
          margin-bottom: 0;
        }
        
        .detail-section h3 {
          margin-bottom: 15px;
          color: #333;
          font-size: 18px;
          border-bottom: 2px solid #667eea;
          padding-bottom: 5px;
        }
        
        .detail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 15px;
        }
        
        .detail-item {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .detail-label {
          font-weight: 500;
          color: #666;
        }
        
        /* Summary Cards */
        .attendance-summary,
        .grades-summary,
        .fees-summary {
          margin-bottom: 30px;
        }
        
        .summary-card {
          background: white;
          border-radius: 10px;
          padding: 25px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .attendance-stats,
        .performance-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        
        .attendance-stat,
        .performance-stat {
          text-align: center;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
        }
        
        .fee-summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }
        
        .fee-summary-grid .summary-card {
          border-left: 4px solid #667eea;
        }
        
        .fee-summary-grid .summary-card.paid {
          border-left-color: #28a745;
        }
        
        .fee-summary-grid .summary-card.pending {
          border-left-color: #dc3545;
        }
        
        .summary-title {
          font-size: 14px;
          color: #666;
          margin-bottom: 10px;
        }
        
        .summary-amount {
          font-size: 24px;
          font-weight: bold;
          color: #333;
        }
        
        .attendance-records,
        .grades-records,
        .fees-records {
          background: white;
          border-radius: 10px;
          padding: 25px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .attendance-records h3,
        .grades-records h3,
        .fees-records h3 {
          margin-bottom: 20px;
          color: #333;
        }
        
        .empty-state {
          text-align: center;
          padding: 40px;
          color: #666;
        }
        
        @media (max-width: 768px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
          
          .profile-header {
            flex-direction: column;
            text-align: center;
          }
          
          .detail-grid {
            grid-template-columns: 1fr;
          }
          
          .detail-item {
            flex-direction: column;
            gap: 5px;
          }
          
          .attendance-stats,
          .performance-stats {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .fee-summary-grid {
            grid-template-columns: 1fr;
          }
          
          .grade-item,
          .fee-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          
          .grade-result,
          .fee-status {
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default StudentDashboard;
