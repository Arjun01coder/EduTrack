import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [courses, setCourses] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [grades, setGrades] = useState([]);
  const [fees, setFees] = useState([]);

  // Initialize demo data
  useEffect(() => {
    initializeDemoData();
  }, []);

  const initializeDemoData = () => {
    // Demo Students
    const demoStudents = [
      {
        id: 1,
        studentId: 'STU001',
        name: 'Mike Wilson',
        email: 'mike.wilson@student.edutrack.com',
        phone: '+1234567890',
        address: '123 Main St, City',
        dateOfBirth: '2005-05-15',
        class: '10th Grade',
        section: 'A',
        rollNumber: '001',
        parentName: 'Robert Wilson',
        parentPhone: '+1234567891',
        admissionDate: '2020-08-15',
        status: 'Active'
      },
      {
        id: 2,
        studentId: 'STU002',
        name: 'Emma Davis',
        email: 'emma.davis@student.edutrack.com',
        phone: '+1234567892',
        address: '456 Oak Ave, City',
        dateOfBirth: '2005-03-22',
        class: '10th Grade',
        section: 'A',
        rollNumber: '002',
        parentName: 'Jennifer Davis',
        parentPhone: '+1234567893',
        admissionDate: '2020-08-15',
        status: 'Active'
      },
      {
        id: 3,
        studentId: 'STU003',
        name: 'Alex Thompson',
        email: 'alex.thompson@student.edutrack.com',
        phone: '+1234567894',
        address: '789 Pine St, City',
        dateOfBirth: '2005-07-10',
        class: '10th Grade',
        section: 'B',
        rollNumber: '003',
        parentName: 'David Thompson',
        parentPhone: '+1234567895',
        admissionDate: '2020-08-15',
        status: 'Active'
      }
    ];

    // Demo Faculty
    const demoFaculty = [
      {
        id: 1,
        facultyId: 'FAC001',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@edutrack.com',
        phone: '+1234567896',
        department: 'Computer Science',
        qualification: 'M.Tech Computer Science',
        experience: '8 years',
        subjects: ['Data Structures', 'Web Development', 'Database Systems'],
        joinDate: '2016-07-01',
        status: 'Active'
      },
      {
        id: 2,
        facultyId: 'FAC002',
        name: 'Dr. Michael Brown',
        email: 'michael.brown@edutrack.com',
        phone: '+1234567897',
        department: 'Mathematics',
        qualification: 'Ph.D Mathematics',
        experience: '12 years',
        subjects: ['Algebra', 'Calculus', 'Statistics'],
        joinDate: '2012-08-15',
        status: 'Active'
      }
    ];

    // Demo Courses
    const demoCourses = [
      {
        id: 1,
        courseCode: 'CS101',
        courseName: 'Data Structures',
        credits: 4,
        department: 'Computer Science',
        instructor: 'Sarah Johnson',
        semester: '1st',
        description: 'Introduction to data structures and algorithms'
      },
      {
        id: 2,
        courseCode: 'MATH101',
        courseName: 'Calculus',
        credits: 3,
        department: 'Mathematics',
        instructor: 'Dr. Michael Brown',
        semester: '1st',
        description: 'Differential and integral calculus'
      },
      {
        id: 3,
        courseCode: 'CS102',
        courseName: 'Web Development',
        credits: 3,
        department: 'Computer Science',
        instructor: 'Sarah Johnson',
        semester: '2nd',
        description: 'HTML, CSS, JavaScript and React development'
      }
    ];

    // Demo Attendance
    const demoAttendance = [
      {
        id: 1,
        studentId: 'STU001',
        studentName: 'Mike Wilson',
        courseCode: 'CS101',
        courseName: 'Data Structures',
        date: '2024-01-15',
        status: 'Present',
        facultyId: 'FAC001'
      },
      {
        id: 2,
        studentId: 'STU002',
        studentName: 'Emma Davis',
        courseCode: 'CS101',
        courseName: 'Data Structures',
        date: '2024-01-15',
        status: 'Present',
        facultyId: 'FAC001'
      },
      {
        id: 3,
        studentId: 'STU001',
        studentName: 'Mike Wilson',
        courseCode: 'MATH101',
        courseName: 'Calculus',
        date: '2024-01-16',
        status: 'Absent',
        facultyId: 'FAC002'
      }
    ];

    // Demo Grades
    const demoGrades = [
      {
        id: 1,
        studentId: 'STU001',
        studentName: 'Mike Wilson',
        courseCode: 'CS101',
        courseName: 'Data Structures',
        examType: 'Midterm',
        marks: 85,
        totalMarks: 100,
        grade: 'A',
        date: '2024-01-20'
      },
      {
        id: 2,
        studentId: 'STU002',
        studentName: 'Emma Davis',
        courseCode: 'CS101',
        courseName: 'Data Structures',
        examType: 'Midterm',
        marks: 92,
        totalMarks: 100,
        grade: 'A+',
        date: '2024-01-20'
      },
      {
        id: 3,
        studentId: 'STU001',
        studentName: 'Mike Wilson',
        courseCode: 'MATH101',
        courseName: 'Calculus',
        examType: 'Quiz 1',
        marks: 78,
        totalMarks: 100,
        grade: 'B+',
        date: '2024-01-18'
      }
    ];

    // Demo Fees
    const demoFees = [
      {
        id: 1,
        studentId: 'STU001',
        studentName: 'Mike Wilson',
        semester: '1st Semester 2024',
        tuitionFee: 5000,
        labFee: 500,
        libraryFee: 200,
        totalAmount: 5700,
        paidAmount: 5700,
        pendingAmount: 0,
        status: 'Paid',
        dueDate: '2024-01-31',
        paidDate: '2024-01-15'
      },
      {
        id: 2,
        studentId: 'STU002',
        studentName: 'Emma Davis',
        semester: '1st Semester 2024',
        tuitionFee: 5000,
        labFee: 500,
        libraryFee: 200,
        totalAmount: 5700,
        paidAmount: 3000,
        pendingAmount: 2700,
        status: 'Partial',
        dueDate: '2024-01-31',
        paidDate: '2024-01-10'
      },
      {
        id: 3,
        studentId: 'STU003',
        studentName: 'Alex Thompson',
        semester: '1st Semester 2024',
        tuitionFee: 5000,
        labFee: 500,
        libraryFee: 200,
        totalAmount: 5700,
        paidAmount: 0,
        pendingAmount: 5700,
        status: 'Pending',
        dueDate: '2024-01-31',
        paidDate: null
      }
    ];

    // Load from localStorage or use demo data
    setStudents(JSON.parse(localStorage.getItem('edutrack_students')) || demoStudents);
    setFaculty(JSON.parse(localStorage.getItem('edutrack_faculty')) || demoFaculty);
    setCourses(JSON.parse(localStorage.getItem('edutrack_courses')) || demoCourses);
    setAttendance(JSON.parse(localStorage.getItem('edutrack_attendance')) || demoAttendance);
    setGrades(JSON.parse(localStorage.getItem('edutrack_grades')) || demoGrades);
    setFees(JSON.parse(localStorage.getItem('edutrack_fees')) || demoFees);
  };

  // Helper functions to update data and save to localStorage
  const updateStudents = (newStudents) => {
    setStudents(newStudents);
    localStorage.setItem('edutrack_students', JSON.stringify(newStudents));
  };

  const updateFaculty = (newFaculty) => {
    setFaculty(newFaculty);
    localStorage.setItem('edutrack_faculty', JSON.stringify(newFaculty));
  };

  const updateCourses = (newCourses) => {
    setCourses(newCourses);
    localStorage.setItem('edutrack_courses', JSON.stringify(newCourses));
  };

  const updateAttendance = (newAttendance) => {
    setAttendance(newAttendance);
    localStorage.setItem('edutrack_attendance', JSON.stringify(newAttendance));
  };

  const updateGrades = (newGrades) => {
    setGrades(newGrades);
    localStorage.setItem('edutrack_grades', JSON.stringify(newGrades));
  };

  const updateFees = (newFees) => {
    setFees(newFees);
    localStorage.setItem('edutrack_fees', JSON.stringify(newFees));
  };

  const value = {
    students,
    faculty,
    courses,
    attendance,
    grades,
    fees,
    updateStudents,
    updateFaculty,
    updateCourses,
    updateAttendance,
    updateGrades,
    updateFees
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
