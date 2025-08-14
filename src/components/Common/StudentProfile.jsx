import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import Modal from '../Common/Modal';
import FileUpload from '../Common/FileUpload';

const StudentProfile = ({ student, onUpdate, onClose }) => {
  const { courses, grades, attendance, fees } = useData();
  const [activeTab, setActiveTab] = useState('personal');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(student);

  const studentCourses = courses.filter(course => 
    course.enrolledStudents?.includes(student.studentId)
  );

  const studentGrades = grades.filter(grade => grade.studentId === student.studentId);
  const studentAttendance = attendance.filter(att => att.studentId === student.studentId);
  const studentFees = fees.filter(fee => fee.studentId === student.studentId);

  const calculateGPA = () => {
    if (studentGrades.length === 0) return 'N/A';
    const gradePoints = { 'A+': 4.0, 'A': 3.7, 'B+': 3.3, 'B': 3.0, 'C+': 2.7, 'C': 2.3, 'D': 1.0, 'F': 0.0 };
    const totalPoints = studentGrades.reduce((sum, grade) => sum + (gradePoints[grade.grade] || 0), 0);
    return (totalPoints / studentGrades.length).toFixed(2);
  };

  const calculateAttendancePercentage = () => {
    if (studentAttendance.length === 0) return 'N/A';
    const presentDays = studentAttendance.filter(att => att.status === 'Present').length;
    return Math.round((presentDays / studentAttendance.length) * 100);
  };

  const getTotalFees = () => {
    return studentFees.reduce((sum, fee) => sum + fee.totalAmount, 0);
  };

  const getPaidFees = () => {
    return studentFees.reduce((sum, fee) => sum + fee.paidAmount, 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onUpdate(formData);
    setEditMode(false);
  };

  const handleFileUpload = (files) => {
    console.log('Uploaded files:', files);
    // Handle file upload logic here
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: '👤' },
    { id: 'academic', label: 'Academic Records', icon: '📚' },
    { id: 'attendance', label: 'Attendance', icon: '📅' },
    { id: 'fees', label: 'Fee Details', icon: '💰' },
    { id: 'documents', label: 'Documents', icon: '📄' },
    { id: 'emergency', label: 'Emergency Contact', icon: '🚨' }
  ];

  return (
    <Modal title="Student Profile" onClose={onClose} size="extra-large">
      <div className="student-profile">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            <img 
              src={student.avatar || `https://ui-avatars.com/api/?name=${student.name}&size=120&background=667eea&color=fff`}
              alt={student.name}
              className="avatar-large"
            />
            <div className="profile-status">
              <span className={`status-badge ${student.status?.toLowerCase()}`}>
                {student.status || 'Active'}
              </span>
            </div>
          </div>
          
          <div className="profile-summary">
            <h2>{student.name}</h2>
            <p className="student-id">ID: {student.studentId}</p>
            <div className="quick-stats">
              <div className="stat-item">
                <span className="stat-label">GPA</span>
                <span className="stat-value">{calculateGPA()}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Attendance</span>
                <span className="stat-value">{calculateAttendancePercentage()}%</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Courses</span>
                <span className="stat-value">{studentCourses.length}</span>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <button 
              onClick={() => setEditMode(!editMode)}
              className={`btn ${editMode ? 'btn-secondary' : 'btn-primary'}`}
            >
              {editMode ? 'Cancel Edit' : 'Edit Profile'}
            </button>
            {editMode && (
              <button onClick={handleSave} className="btn btn-success">
                Save Changes
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="profile-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {/* Personal Information */}
          {activeTab === 'personal' && (
            <div className="tab-panel">
              <h3>Personal Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-control"
                    disabled={!editMode}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-control"
                    disabled={!editMode}
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleInputChange}
                    className="form-control"
                    disabled={!editMode}
                  />
                </div>
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth || ''}
                    onChange={handleInputChange}
                    className="form-control"
                    disabled={!editMode}
                  />
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <select
                    name="gender"
                    value={formData.gender || ''}
                    onChange={handleInputChange}
                    className="form-control"
                    disabled={!editMode}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Blood Group</label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup || ''}
                    onChange={handleInputChange}
                    className="form-control"
                    disabled={!editMode}
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>Address</label>
                  <textarea
                    name="address"
                    value={formData.address || ''}
                    onChange={handleInputChange}
                    className="form-control"
                    rows="3"
                    disabled={!editMode}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Academic Records */}
          {activeTab === 'academic' && (
            <div className="tab-panel">
              <h3>Academic Records</h3>
              
              <div className="academic-summary">
                <div className="summary-card">
                  <h4>Current GPA</h4>
                  <div className="gpa-display">{calculateGPA()}</div>
                </div>
                <div className="summary-card">
                  <h4>Enrolled Courses</h4>
                  <div className="course-count">{studentCourses.length}</div>
                </div>
                <div className="summary-card">
                  <h4>Credits Completed</h4>
                  <div className="credits">{studentCourses.length * 3}</div>
                </div>
              </div>

              <div className="grades-table">
                <h4>Course Grades</h4>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Grade</th>
                      <th>Credits</th>
                      <th>Semester</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentGrades.map(grade => {
                      const course = courses.find(c => c.id === grade.courseId);
                      return (
                        <tr key={grade.id}>
                          <td>{course?.name || 'Unknown Course'}</td>
                          <td>
                            <span className={`grade-badge grade-${grade.grade.toLowerCase().replace('+', 'plus')}`}>
                              {grade.grade}
                            </span>
                          </td>
                          <td>{course?.credits || 3}</td>
                          <td>{grade.semester}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Attendance */}
          {activeTab === 'attendance' && (
            <div className="tab-panel">
              <h3>Attendance Records</h3>
              
              <div className="attendance-summary">
                <div className="attendance-chart">
                  <div className="chart-title">Overall Attendance</div>
                  <div className="circular-progress">
                    <div className="progress-value">{calculateAttendancePercentage()}%</div>
                  </div>
                </div>
              </div>

              <div className="attendance-table">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Course</th>
                      <th>Status</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentAttendance.slice(0, 10).map((att, index) => {
                      const course = courses.find(c => c.id === att.courseId);
                      return (
                        <tr key={index}>
                          <td>{new Date(att.date).toLocaleDateString()}</td>
                          <td>{course?.name || 'Unknown Course'}</td>
                          <td>
                            <span className={`status-badge ${att.status.toLowerCase()}`}>
                              {att.status}
                            </span>
                          </td>
                          <td>{att.remarks || '-'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Fee Details */}
          {activeTab === 'fees' && (
            <div className="tab-panel">
              <h3>Fee Information</h3>
              
              <div className="fee-summary">
                <div className="summary-card">
                  <h4>Total Fees</h4>
                  <div className="fee-amount">₹{getTotalFees().toLocaleString()}</div>
                </div>
                <div className="summary-card paid">
                  <h4>Amount Paid</h4>
                  <div className="fee-amount">₹{getPaidFees().toLocaleString()}</div>
                </div>
                <div className="summary-card pending">
                  <h4>Pending Amount</h4>
                  <div className="fee-amount">₹{(getTotalFees() - getPaidFees()).toLocaleString()}</div>
                </div>
              </div>

              <div className="fee-table">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Semester</th>
                      <th>Total Amount</th>
                      <th>Paid Amount</th>
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
                        <td>
                          <span className={`status-badge ${fee.status.toLowerCase()}`}>
                            {fee.status}
                          </span>
                        </td>
                        <td>{fee.dueDate ? new Date(fee.dueDate).toLocaleDateString() : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Documents */}
          {activeTab === 'documents' && (
            <div className="tab-panel">
              <h3>Document Management</h3>
              
              <FileUpload
                onFileSelect={handleFileUpload}
                acceptedTypes=".pdf,.doc,.docx,.jpg,.png,.jpeg"
                maxSize={5}
                multiple={true}
                label="Upload Student Documents"
              />

              <div className="document-categories">
                <div className="category-section">
                  <h4>📋 Academic Documents</h4>
                  <div className="document-list">
                    <div className="document-item">
                      <span className="doc-icon">📄</span>
                      <span className="doc-name">Transcript.pdf</span>
                      <span className="doc-date">2024-01-15</span>
                    </div>
                    <div className="document-item">
                      <span className="doc-icon">📄</span>
                      <span className="doc-name">Certificates.pdf</span>
                      <span className="doc-date">2024-01-10</span>
                    </div>
                  </div>
                </div>

                <div className="category-section">
                  <h4>🆔 Identity Documents</h4>
                  <div className="document-list">
                    <div className="document-item">
                      <span className="doc-icon">🖼️</span>
                      <span className="doc-name">Student_ID.jpg</span>
                      <span className="doc-date">2024-01-01</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Emergency Contact */}
          {activeTab === 'emergency' && (
            <div className="tab-panel">
              <h3>Emergency Contact Information</h3>
              
              <div className="form-grid">
                <div className="form-group">
                  <label>Guardian Name</label>
                  <input
                    type="text"
                    name="guardianName"
                    value={formData.guardianName || ''}
                    onChange={handleInputChange}
                    className="form-control"
                    disabled={!editMode}
                  />
                </div>
                <div className="form-group">
                  <label>Relationship</label>
                  <select
                    name="guardianRelation"
                    value={formData.guardianRelation || ''}
                    onChange={handleInputChange}
                    className="form-control"
                    disabled={!editMode}
                  >
                    <option value="">Select Relationship</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Spouse">Spouse</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="guardianPhone"
                    value={formData.guardianPhone || ''}
                    onChange={handleInputChange}
                    className="form-control"
                    disabled={!editMode}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="guardianEmail"
                    value={formData.guardianEmail || ''}
                    onChange={handleInputChange}
                    className="form-control"
                    disabled={!editMode}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Address</label>
                  <textarea
                    name="guardianAddress"
                    value={formData.guardianAddress || ''}
                    onChange={handleInputChange}
                    className="form-control"
                    rows="3"
                    disabled={!editMode}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .student-profile {
          max-width: 100%;
        }

        .profile-header {
          display: flex;
          align-items: center;
          gap: 30px;
          padding: 30px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          color: white;
          margin-bottom: 30px;
        }

        .profile-avatar {
          position: relative;
        }

        .avatar-large {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          border: 4px solid rgba(255, 255, 255, 0.3);
        }

        .profile-status {
          position: absolute;
          bottom: 10px;
          right: 10px;
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status-badge.active {
          background: #28a745;
          color: white;
        }

        .profile-summary {
          flex: 1;
        }

        .profile-summary h2 {
          margin: 0 0 5px 0;
          font-size: 28px;
          font-weight: 700;
        }

        .student-id {
          margin: 0 0 20px 0;
          opacity: 0.9;
          font-size: 16px;
        }

        .quick-stats {
          display: flex;
          gap: 30px;
        }

        .stat-item {
          text-align: center;
        }

        .stat-label {
          display: block;
          font-size: 12px;
          opacity: 0.8;
          margin-bottom: 5px;
        }

        .stat-value {
          display: block;
          font-size: 24px;
          font-weight: bold;
        }

        .profile-actions {
          display: flex;
          gap: 15px;
          flex-direction: column;
        }

        .profile-tabs {
          display: flex;
          border-bottom: 2px solid #eee;
          margin-bottom: 30px;
          overflow-x: auto;
        }

        .tab-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 15px 20px;
          border: none;
          background: none;
          cursor: pointer;
          border-bottom: 3px solid transparent;
          transition: all 0.3s ease;
          white-space: nowrap;
          font-size: 14px;
          color: #666;
        }

        .tab-button:hover {
          background: #f8f9fa;
          color: #333;
        }

        .tab-button.active {
          color: #667eea;
          border-bottom-color: #667eea;
          background: #f0f8ff;
        }

        .tab-icon {
          font-size: 16px;
        }

        .tab-content {
          min-height: 400px;
        }

        .tab-panel h3 {
          margin: 0 0 25px 0;
          color: #333;
          font-size: 20px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
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

        .form-control:disabled {
          background: #f8f9fa;
          color: #666;
        }

        .academic-summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .summary-card {
          background: white;
          border: 1px solid #eee;
          border-radius: 12px;
          padding: 25px;
          text-align: center;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .summary-card h4 {
          margin: 0 0 15px 0;
          color: #666;
          font-size: 14px;
          font-weight: 500;
        }

        .gpa-display,
        .course-count,
        .credits,
        .fee-amount {
          font-size: 28px;
          font-weight: bold;
          color: #333;
        }

        .summary-card.paid .fee-amount {
          color: #28a745;
        }

        .summary-card.pending .fee-amount {
          color: #dc3545;
        }

        .grades-table,
        .attendance-table,
        .fee-table {
          margin-top: 30px;
        }

        .grades-table h4,
        .attendance-table h4,
        .fee-table h4 {
          margin-bottom: 15px;
          color: #333;
        }

        .table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .table th,
        .table td {
          padding: 15px;
          text-align: left;
          border-bottom: 1px solid #eee;
        }

        .table th {
          background: #f8f9fa;
          font-weight: 600;
          color: #333;
        }

        .grade-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: bold;
          color: white;
        }

        .grade-badge.grade-aplus,
        .grade-badge.grade-a {
          background: #28a745;
        }

        .grade-badge.grade-bplus,
        .grade-badge.grade-b {
          background: #17a2b8;
        }

        .grade-badge.grade-cplus,
        .grade-badge.grade-c {
          background: #ffc107;
          color: #333;
        }

        .grade-badge.grade-d,
        .grade-badge.grade-f {
          background: #dc3545;
        }

        .attendance-summary {
          display: flex;
          justify-content: center;
          margin-bottom: 30px;
        }

        .attendance-chart {
          text-align: center;
        }

        .chart-title {
          margin-bottom: 20px;
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }

        .circular-progress {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: conic-gradient(#667eea 0% ${calculateAttendancePercentage()}%, #e0e0e0 ${calculateAttendancePercentage()}% 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
        }

        .progress-value {
          background: white;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: bold;
          color: #333;
        }

        .fee-summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .document-categories {
          margin-top: 30px;
        }

        .category-section {
          margin-bottom: 30px;
        }

        .category-section h4 {
          margin-bottom: 15px;
          color: #333;
          padding-bottom: 10px;
          border-bottom: 2px solid #eee;
        }

        .document-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .document-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
          border: 1px solid #eee;
        }

        .doc-icon {
          font-size: 20px;
        }

        .doc-name {
          flex: 1;
          font-weight: 500;
          color: #333;
        }

        .doc-date {
          color: #666;
          font-size: 12px;
        }

        .status-badge.present {
          background: #28a745;
          color: white;
        }

        .status-badge.absent {
          background: #dc3545;
          color: white;
        }

        .status-badge.late {
          background: #ffc107;
          color: #333;
        }

        .status-badge.paid {
          background: #28a745;
          color: white;
        }

        .status-badge.pending {
          background: #dc3545;
          color: white;
        }

        .status-badge.partial {
          background: #ffc107;
          color: #333;
        }

        @media (max-width: 768px) {
          .profile-header {
            flex-direction: column;
            text-align: center;
            gap: 20px;
            padding: 20px;
          }

          .quick-stats {
            justify-content: center;
            gap: 20px;
          }

          .profile-actions {
            flex-direction: row;
          }

          .form-grid {
            grid-template-columns: 1fr;
            gap: 15px;
          }

          .academic-summary,
          .fee-summary {
            grid-template-columns: 1fr;
          }

          .tab-button {
            padding: 12px 15px;
          }

          .tab-label {
            display: none;
          }

          .table {
            font-size: 12px;
          }

          .table th,
          .table td {
            padding: 10px 8px;
          }
        }
      `}</style>
    </Modal>
  );
};

export default StudentProfile;
