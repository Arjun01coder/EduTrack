import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Modal from '../Common/Modal';

const AttendanceManagement = () => {
  const { user } = useAuth();
  const { students, courses, attendance, updateAttendance } = useData();
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState({});

  // Get faculty's courses
  const facultyCourses = courses.filter(course => course.instructor === user.name);
  
  // Get attendance records for selected date and course
  const getExistingAttendance = () => {
    return attendance.filter(record => 
      record.date === selectedDate && 
      record.courseCode === selectedCourse
    );
  };

  // Get students for selected course (simplified - in real app would be more complex)
  const getCourseStudents = () => {
    if (!selectedCourse) return [];
    const course = courses.find(c => c.courseCode === selectedCourse);
    if (!course) return [];
    
    // For demo, return students from the same class/semester
    return students.filter(student => 
      student.class.includes(course.semester) || 
      student.class.includes('10th') // Demo data adjustment
    );
  };

  const handleTakeAttendance = () => {
    if (!selectedCourse) {
      alert('Please select a course first');
      return;
    }
    
    const existingAttendance = getExistingAttendance();
    const courseStudents = getCourseStudents();
    const course = courses.find(c => c.courseCode === selectedCourse);
    
    // Initialize attendance records
    const initialRecords = {};
    courseStudents.forEach(student => {
      const existing = existingAttendance.find(record => record.studentId === student.studentId);
      initialRecords[student.studentId] = existing ? existing.status : 'Present';
    });
    
    setAttendanceRecords(initialRecords);
    setShowModal(true);
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSubmitAttendance = () => {
    const courseStudents = getCourseStudents();
    const course = courses.find(c => c.courseCode === selectedCourse);
    const facultyId = `FAC${user.id.toString().padStart(3, '0')}`;
    
    // Remove existing attendance for this date and course
    const filteredAttendance = attendance.filter(record => 
      !(record.date === selectedDate && record.courseCode === selectedCourse)
    );
    
    // Add new attendance records
    const newRecords = courseStudents.map(student => ({
      id: Date.now() + Math.random(),
      studentId: student.studentId,
      studentName: student.name,
      courseCode: course.courseCode,
      courseName: course.courseName,
      date: selectedDate,
      status: attendanceRecords[student.studentId] || 'Present',
      facultyId: facultyId
    }));
    
    updateAttendance([...filteredAttendance, ...newRecords]);
    setShowModal(false);
    setAttendanceRecords({});
  };

  const getAttendanceStats = () => {
    if (!selectedCourse) return { total: 0, present: 0, absent: 0 };
    
    const courseAttendance = attendance.filter(record => record.courseCode === selectedCourse);
    const total = courseAttendance.length;
    const present = courseAttendance.filter(record => record.status === 'Present').length;
    const absent = total - present;
    
    return { total, present, absent };
  };

  const getRecentAttendance = () => {
    const facultyId = `FAC${user.id.toString().padStart(3, '0')}`;
    return attendance
      .filter(record => record.facultyId === facultyId)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);
  };

  const stats = getAttendanceStats();
  const recentAttendance = getRecentAttendance();

  return (
    <div className="attendance-management">
      <div className="section-header">
        <h2>Attendance Management</h2>
        <div className="header-actions">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-input"
          />
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="course-select"
          >
            <option value="">Select Course</option>
            {facultyCourses.map(course => (
              <option key={course.id} value={course.courseCode}>
                {course.courseCode} - {course.courseName}
              </option>
            ))}
          </select>
          <button 
            onClick={handleTakeAttendance}
            className="btn btn-primary"
            disabled={!selectedCourse}
          >
            Take Attendance
          </button>
        </div>
      </div>

      {selectedCourse && (
        <div className="attendance-stats">
          <div className="stat-card">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total Records</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.present}</div>
            <div className="stat-label">Present</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.absent}</div>
            <div className="stat-label">Absent</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {stats.total > 0 ? ((stats.present / stats.total) * 100).toFixed(1) : 0}%
            </div>
            <div className="stat-label">Attendance Rate</div>
          </div>
        </div>
      )}

      <div className="recent-attendance">
        <h3>Recent Attendance Records</h3>
        <div className="attendance-table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Course</th>
                <th>Student</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentAttendance.map(record => (
                <tr key={record.id}>
                  <td>{new Date(record.date).toLocaleDateString()}</td>
                  <td>{record.courseName}</td>
                  <td>{record.studentName}</td>
                  <td>
                    <span className={`badge ${record.status === 'Present' ? 'badge-success' : 'badge-danger'}`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentAttendance.length === 0 && (
            <div className="empty-state">
              <p>No attendance records found.</p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <Modal
          title={`Take Attendance - ${selectedDate}`}
          onClose={() => setShowModal(false)}
        >
          <div className="attendance-form">
            <div className="course-info">
              <h4>{courses.find(c => c.courseCode === selectedCourse)?.courseName}</h4>
              <p>Course Code: {selectedCourse}</p>
            </div>
            
            <div className="students-attendance">
              {getCourseStudents().map(student => (
                <div key={student.id} className="student-attendance-row">
                  <div className="student-info">
                    <div className="student-name">{student.name}</div>
                    <div className="student-id">{student.studentId}</div>
                  </div>
                  <div className="attendance-options">
                    <label className="radio-option">
                      <input
                        type="radio"
                        name={`attendance-${student.studentId}`}
                        value="Present"
                        checked={attendanceRecords[student.studentId] === 'Present'}
                        onChange={(e) => handleAttendanceChange(student.studentId, e.target.value)}
                      />
                      <span className="radio-label present">Present</span>
                    </label>
                    <label className="radio-option">
                      <input
                        type="radio"
                        name={`attendance-${student.studentId}`}
                        value="Absent"
                        checked={attendanceRecords[student.studentId] === 'Absent'}
                        onChange={(e) => handleAttendanceChange(student.studentId, e.target.value)}
                      />
                      <span className="radio-label absent">Absent</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                onClick={() => setShowModal(false)} 
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={handleSubmitAttendance} 
                className="btn btn-primary"
              >
                Save Attendance
              </button>
            </div>
          </div>
        </Modal>
      )}

      <style jsx>{`
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          flex-wrap: wrap;
          gap: 15px;
        }
        
        .header-actions {
          display: flex;
          gap: 15px;
          align-items: center;
          flex-wrap: wrap;
        }
        
        .date-input,
        .course-select {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
        
        .course-select {
          min-width: 200px;
        }
        
        .attendance-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .stat-card {
          background: white;
          border-radius: 10px;
          padding: 20px;
          text-align: center;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          border-left: 4px solid #667eea;
        }
        
        .stat-number {
          font-size: 24px;
          font-weight: bold;
          color: #333;
          margin-bottom: 5px;
        }
        
        .stat-label {
          color: #666;
          font-size: 14px;
        }
        
        .recent-attendance {
          background: white;
          border-radius: 10px;
          padding: 25px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .recent-attendance h3 {
          margin-bottom: 20px;
          color: #333;
        }
        
        .empty-state {
          text-align: center;
          padding: 40px;
          color: #666;
        }
        
        .attendance-form {
          max-height: 70vh;
          overflow-y: auto;
        }
        
        .course-info {
          margin-bottom: 20px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
        }
        
        .course-info h4 {
          margin: 0 0 5px 0;
          color: #333;
        }
        
        .course-info p {
          margin: 0;
          color: #666;
          font-size: 14px;
        }
        
        .students-attendance {
          margin-bottom: 20px;
        }
        
        .student-attendance-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          border-bottom: 1px solid #eee;
        }
        
        .student-info {
          flex: 1;
        }
        
        .student-name {
          font-weight: 500;
          color: #333;
          margin-bottom: 3px;
        }
        
        .student-id {
          font-size: 12px;
          color: #666;
          font-family: monospace;
        }
        
        .attendance-options {
          display: flex;
          gap: 15px;
        }
        
        .radio-option {
          display: flex;
          align-items: center;
          gap: 5px;
          cursor: pointer;
        }
        
        .radio-label {
          font-size: 14px;
          font-weight: 500;
        }
        
        .radio-label.present {
          color: #28a745;
        }
        
        .radio-label.absent {
          color: #dc3545;
        }
        
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }
        
        @media (max-width: 768px) {
          .section-header {
            flex-direction: column;
            align-items: stretch;
          }
          
          .header-actions {
            flex-direction: column;
          }
          
          .course-select {
            min-width: auto;
          }
          
          .student-attendance-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          
          .attendance-options {
            justify-content: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default AttendanceManagement;
