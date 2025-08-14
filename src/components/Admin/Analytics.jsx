import React from 'react';
import { useData } from '../../context/DataContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Analytics = () => {
  const { students, faculty, courses, fees, attendance, grades } = useData();

  // Student enrollment by class
  const getStudentsByClass = () => {
    const classCount = {};
    students.forEach(student => {
      classCount[student.class] = (classCount[student.class] || 0) + 1;
    });
    return classCount;
  };

  // Fee status distribution
  const getFeeStatusDistribution = () => {
    const statusCount = {};
    fees.forEach(fee => {
      statusCount[fee.status] = (statusCount[fee.status] || 0) + 1;
    });
    return statusCount;
  };

  // Faculty by department
  const getFacultyByDepartment = () => {
    const deptCount = {};
    faculty.forEach(member => {
      deptCount[member.department] = (deptCount[member.department] || 0) + 1;
    });
    return deptCount;
  };

  // Attendance trends (mock data for demonstration)
  const getAttendanceTrends = () => {
    return {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Average Attendance %',
          data: [85, 88, 92, 87, 90, 94],
          borderColor: 'rgb(102, 126, 234)',
          backgroundColor: 'rgba(102, 126, 234, 0.2)',
          tension: 0.1,
        },
      ],
    };
  };

  // Grade distribution
  const getGradeDistribution = () => {
    const gradeCount = {};
    grades.forEach(grade => {
      gradeCount[grade.grade] = (gradeCount[grade.grade] || 0) + 1;
    });
    return gradeCount;
  };

  const studentsByClass = getStudentsByClass();
  const feeStatusDistribution = getFeeStatusDistribution();
  const facultyByDepartment = getFacultyByDepartment();
  const gradeDistribution = getGradeDistribution();

  // Chart configurations
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  const barData = {
    labels: Object.keys(studentsByClass),
    datasets: [
      {
        label: 'Number of Students',
        data: Object.values(studentsByClass),
        backgroundColor: 'rgba(102, 126, 234, 0.8)',
        borderColor: 'rgba(102, 126, 234, 1)',
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: Object.keys(feeStatusDistribution),
    datasets: [
      {
        data: Object.values(feeStatusDistribution),
        backgroundColor: [
          'rgba(40, 167, 69, 0.8)',
          'rgba(255, 193, 7, 0.8)',
          'rgba(220, 53, 69, 0.8)',
        ],
        borderColor: [
          'rgba(40, 167, 69, 1)',
          'rgba(255, 193, 7, 1)',
          'rgba(220, 53, 69, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const departmentData = {
    labels: Object.keys(facultyByDepartment),
    datasets: [
      {
        label: 'Faculty Members',
        data: Object.values(facultyByDepartment),
        backgroundColor: 'rgba(118, 75, 162, 0.8)',
        borderColor: 'rgba(118, 75, 162, 1)',
        borderWidth: 1,
      },
    ],
  };

  const gradeData = {
    labels: Object.keys(gradeDistribution),
    datasets: [
      {
        label: 'Number of Grades',
        data: Object.values(gradeDistribution),
        backgroundColor: [
          'rgba(40, 167, 69, 0.8)',
          'rgba(102, 126, 234, 0.8)',
          'rgba(255, 193, 7, 0.8)',
          'rgba(220, 53, 69, 0.8)',
        ],
        borderColor: [
          'rgba(40, 167, 69, 1)',
          'rgba(102, 126, 234, 1)',
          'rgba(255, 193, 7, 1)',
          'rgba(220, 53, 69, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="analytics">
      <div className="analytics-header">
        <h2>Analytics Dashboard</h2>
        <p>Comprehensive insights into institutional performance</p>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <div className="metric-number">{students.length}</div>
            <div className="metric-label">Total Students</div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">👨‍🏫</div>
          <div className="metric-content">
            <div className="metric-number">{faculty.length}</div>
            <div className="metric-label">Faculty Members</div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">📚</div>
          <div className="metric-content">
            <div className="metric-number">{courses.length}</div>
            <div className="metric-label">Active Courses</div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <div className="metric-number">
              ₹{fees.reduce((sum, fee) => sum + fee.paidAmount, 0).toLocaleString()}
            </div>
            <div className="metric-label">Fees Collected</div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Students by Class</h3>
          <div className="chart-container">
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-card">
          <h3>Fee Payment Status</h3>
          <div className="chart-container">
            <Pie data={pieData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-card">
          <h3>Faculty by Department</h3>
          <div className="chart-container">
            <Bar data={departmentData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-card">
          <h3>Grade Distribution</h3>
          <div className="chart-container">
            <Bar data={gradeData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-card span-2">
          <h3>Attendance Trends</h3>
          <div className="chart-container">
            <Line data={getAttendanceTrends()} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="summary-section">
        <div className="summary-card">
          <h3>Quick Statistics</h3>
          <div className="stats-list">
            <div className="stat-item">
              <span className="stat-label">Average Fee Collection Rate:</span>
              <span className="stat-value">
                {((fees.reduce((sum, fee) => sum + fee.paidAmount, 0) / 
                   fees.reduce((sum, fee) => sum + fee.totalAmount, 0)) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Student-Faculty Ratio:</span>
              <span className="stat-value">
                {faculty.length > 0 ? (students.length / faculty.length).toFixed(1) : 0}:1
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Most Popular Class:</span>
              <span className="stat-value">
                {Object.keys(studentsByClass).reduce((a, b) => 
                  studentsByClass[a] > studentsByClass[b] ? a : b, 'N/A')}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Pending Fee Amount:</span>
              <span className="stat-value">
                ₹{fees.reduce((sum, fee) => sum + fee.pendingAmount, 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .analytics {
          padding: 20px 0;
        }
        
        .analytics-header {
          margin-bottom: 30px;
          text-align: center;
        }
        
        .analytics-header h2 {
          color: #333;
          margin-bottom: 10px;
        }
        
        .analytics-header p {
          color: #666;
          font-size: 16px;
        }
        
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }
        
        .metric-card {
          background: white;
          border-radius: 12px;
          padding: 25px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          gap: 20px;
        }
        
        .metric-icon {
          font-size: 32px;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 12px;
        }
        
        .metric-content {
          flex: 1;
        }
        
        .metric-number {
          font-size: 24px;
          font-weight: bold;
          color: #333;
          margin-bottom: 5px;
        }
        
        .metric-label {
          color: #666;
          font-size: 14px;
        }
        
        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 30px;
          margin-bottom: 40px;
        }
        
        .chart-card {
          background: white;
          border-radius: 12px;
          padding: 25px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .chart-card.span-2 {
          grid-column: span 2;
        }
        
        .chart-card h3 {
          margin-bottom: 20px;
          color: #333;
          font-size: 18px;
        }
        
        .chart-container {
          height: 300px;
        }
        
        .summary-section {
          display: grid;
          gap: 30px;
        }
        
        .summary-card {
          background: white;
          border-radius: 12px;
          padding: 25px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .summary-card h3 {
          margin-bottom: 20px;
          color: #333;
        }
        
        .stats-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 15px;
        }
        
        .stat-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
        }
        
        .stat-label {
          color: #666;
          font-weight: 500;
        }
        
        .stat-value {
          color: #333;
          font-weight: bold;
        }
        
        @media (max-width: 1200px) {
          .chart-card.span-2 {
            grid-column: span 1;
          }
        }
        
        @media (max-width: 768px) {
          .charts-grid {
            grid-template-columns: 1fr;
          }
          
          .metrics-grid {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          }
          
          .metric-card {
            flex-direction: column;
            text-align: center;
            gap: 15px;
          }
          
          .stats-list {
            grid-template-columns: 1fr;
          }
          
          .stat-item {
            flex-direction: column;
            gap: 5px;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default Analytics;
