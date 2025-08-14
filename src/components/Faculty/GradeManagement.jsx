import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Modal from '../Common/Modal';

const GradeManagement = () => {
  const { user } = useAuth();
  const { students, courses, grades, updateGrades } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    courseCode: '',
    courseName: '',
    examType: '',
    marks: '',
    totalMarks: '',
    grade: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Get faculty's courses
  const facultyCourses = courses.filter(course => course.instructor === user.name);
  
  // Get grades for faculty's courses
  const facultyGrades = grades.filter(grade => 
    facultyCourses.some(course => course.courseCode === grade.courseCode)
  );

  // Filter grades based on selected course and search term
  const filteredGrades = facultyGrades.filter(grade => {
    const matchesCourse = !selectedCourse || grade.courseCode === selectedCourse;
    const matchesSearch = !searchTerm || 
      grade.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grade.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCourse && matchesSearch;
  });

  // Calculate grade from marks
  const calculateGrade = (marks, totalMarks) => {
    const percentage = (marks / totalMarks) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    if (percentage >= 40) return 'D';
    return 'F';
  };

  // Get students for selected course
  const getCourseStudents = () => {
    if (!selectedCourse) return [];
    const course = courses.find(c => c.courseCode === selectedCourse);
    if (!course) return [];
    
    return students.filter(student => 
      student.class.includes(course.semester) || 
      student.class.includes('10th')
    );
  };

  const handleAddGrade = () => {
    setEditingGrade(null);
    setFormData({
      studentId: '',
      studentName: '',
      courseCode: '',
      courseName: '',
      examType: '',
      marks: '',
      totalMarks: '100',
      grade: '',
      date: new Date().toISOString().split('T')[0]
    });
    setShowModal(true);
  };

  const handleEditGrade = (grade) => {
    setEditingGrade(grade);
    setFormData({
      ...grade,
      date: grade.date || new Date().toISOString().split('T')[0]
    });
    setShowModal(true);
  };

  const handleDeleteGrade = (gradeId) => {
    if (window.confirm('Are you sure you want to delete this grade?')) {
      const updatedGrades = grades.filter(grade => grade.id !== gradeId);
      updateGrades(updatedGrades);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const marks = parseFloat(formData.marks);
    const totalMarks = parseFloat(formData.totalMarks);
    const calculatedGrade = calculateGrade(marks, totalMarks);
    
    const gradeData = {
      ...formData,
      marks,
      totalMarks,
      grade: calculatedGrade
    };
    
    if (editingGrade) {
      const updatedGrades = grades.map(grade => 
        grade.id === editingGrade.id ? { ...gradeData, id: editingGrade.id } : grade
      );
      updateGrades(updatedGrades);
    } else {
      const newGrade = {
        ...gradeData,
        id: Date.now()
      };
      updateGrades([...grades, newGrade]);
    }
    
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-fill related fields
    if (name === 'studentId') {
      const student = students.find(s => s.studentId === value);
      if (student) {
        setFormData(prev => ({ ...prev, studentName: student.name }));
      }
    }
    
    if (name === 'courseCode') {
      const course = courses.find(c => c.courseCode === value);
      if (course) {
        setFormData(prev => ({ ...prev, courseName: course.courseName }));
      }
    }
  };

  const getGradeStats = () => {
    if (!selectedCourse) return {};
    
    const courseGrades = facultyGrades.filter(grade => grade.courseCode === selectedCourse);
    const gradeDistribution = {};
    let totalMarks = 0;
    
    courseGrades.forEach(grade => {
      gradeDistribution[grade.grade] = (gradeDistribution[grade.grade] || 0) + 1;
      totalMarks += (grade.marks / grade.totalMarks) * 100;
    });
    
    const averagePercentage = courseGrades.length > 0 ? totalMarks / courseGrades.length : 0;
    
    return {
      distribution: gradeDistribution,
      average: averagePercentage.toFixed(1),
      total: courseGrades.length
    };
  };

  const stats = getGradeStats();

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

  return (
    <div className="grade-management">
      <div className="section-header">
        <h2>Grade Management</h2>
        <div className="header-actions">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="course-filter"
          >
            <option value="">All Courses</option>
            {facultyCourses.map(course => (
              <option key={course.id} value={course.courseCode}>
                {course.courseCode} - {course.courseName}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button 
            onClick={handleAddGrade}
            className="btn btn-primary"
          >
            Add Grade
          </button>
        </div>
      </div>

      {selectedCourse && stats.total > 0 && (
        <div className="grade-stats">
          <div className="stats-overview">
            <div className="stat-card">
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">Total Grades</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.average}%</div>
              <div className="stat-label">Class Average</div>
            </div>
          </div>
          
          <div className="grade-distribution">
            <h4>Grade Distribution</h4>
            <div className="distribution-grid">
              {Object.entries(stats.distribution).map(([grade, count]) => (
                <div key={grade} className="grade-item">
                  <span className={`badge ${getGradeBadgeClass(grade)}`}>{grade}</span>
                  <span className="grade-count">{count} students</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grades-table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Student Name</th>
              <th>Course</th>
              <th>Exam Type</th>
              <th>Marks</th>
              <th>Grade</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredGrades.map(grade => (
              <tr key={grade.id}>
                <td>{grade.studentId}</td>
                <td>{grade.studentName}</td>
                <td>{grade.courseName}</td>
                <td>{grade.examType}</td>
                <td>{grade.marks}/{grade.totalMarks}</td>
                <td>
                  <span className={`badge ${getGradeBadgeClass(grade.grade)}`}>
                    {grade.grade}
                  </span>
                </td>
                <td>{grade.date ? new Date(grade.date).toLocaleDateString() : '-'}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      onClick={() => handleEditGrade(grade)}
                      className="btn btn-secondary btn-small"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteGrade(grade.id)}
                      className="btn btn-danger btn-small"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredGrades.length === 0 && (
          <div className="empty-state">
            <p>No grades found matching your criteria.</p>
          </div>
        )}
      </div>

      {showModal && (
        <Modal
          title={editingGrade ? 'Edit Grade' : 'Add New Grade'}
          onClose={() => setShowModal(false)}
        >
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Student *</label>
                <select
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                >
                  <option value="">Select Student</option>
                  {students.map(student => (
                    <option key={student.id} value={student.studentId}>
                      {student.studentId} - {student.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Course *</label>
                <select
                  name="courseCode"
                  value={formData.courseCode}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                >
                  <option value="">Select Course</option>
                  {facultyCourses.map(course => (
                    <option key={course.id} value={course.courseCode}>
                      {course.courseCode} - {course.courseName}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Exam Type *</label>
                <select
                  name="examType"
                  value={formData.examType}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                >
                  <option value="">Select Exam Type</option>
                  <option value="Quiz">Quiz</option>
                  <option value="Assignment">Assignment</option>
                  <option value="Midterm">Midterm</option>
                  <option value="Final">Final Exam</option>
                  <option value="Project">Project</option>
                  <option value="Lab">Lab Work</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Marks Obtained *</label>
                <input
                  type="number"
                  name="marks"
                  value={formData.marks}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                  min="0"
                  step="0.1"
                />
              </div>
              
              <div className="form-group">
                <label>Total Marks *</label>
                <input
                  type="number"
                  name="totalMarks"
                  value={formData.totalMarks}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                  min="1"
                  step="0.1"
                />
              </div>
              
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
            </div>
            
            {formData.marks && formData.totalMarks && (
              <div className="grade-preview">
                <p>Calculated Grade: <strong>{calculateGrade(parseFloat(formData.marks), parseFloat(formData.totalMarks))}</strong></p>
                <p>Percentage: <strong>{((parseFloat(formData.marks) / parseFloat(formData.totalMarks)) * 100).toFixed(1)}%</strong></p>
              </div>
            )}
            
            <div className="form-actions">
              <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingGrade ? 'Update Grade' : 'Add Grade'}
              </button>
            </div>
          </form>
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
        
        .search-input,
        .course-filter {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
        
        .course-filter {
          min-width: 200px;
        }
        
        .grade-stats {
          background: white;
          border-radius: 10px;
          padding: 25px;
          margin-bottom: 30px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .stats-overview {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 25px;
        }
        
        .stat-card {
          text-align: center;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
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
        
        .grade-distribution h4 {
          margin-bottom: 15px;
          color: #333;
        }
        
        .distribution-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 15px;
        }
        
        .grade-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
        }
        
        .grade-count {
          font-size: 12px;
          color: #666;
        }
        
        .action-buttons {
          display: flex;
          gap: 5px;
        }
        
        .btn-small {
          padding: 5px 10px;
          font-size: 12px;
        }
        
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #666;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 15px;
        }
        
        .grade-preview {
          margin: 20px 0;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
          border-left: 4px solid #667eea;
        }
        
        .grade-preview p {
          margin: 5px 0;
          color: #333;
        }
        
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
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
          
          .course-filter {
            min-width: auto;
          }
          
          .stats-overview {
            grid-template-columns: 1fr;
          }
          
          .distribution-grid {
            grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          }
          
          .table {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default GradeManagement;
