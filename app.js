// ===== DATA STORAGE =====
let currentUser = null;
let studentsData = [];
let facultyData = [];
let coursesData = [];
let attendanceData = [];
let gradesData = [];
let feesData = [];
let activityLog = [];

// ===== INITIAL SAMPLE DATA =====
function initializeSampleData() {
    studentsData = [
        { id: 'S001', name: 'John Doe', email: 'john@example.com', phone: '1234567890', class: 'Class 1', section: 'A', rollNumber: '101', status: 'Active', gender: 'Male', bloodGroup: 'O+', address: '123 Main St', dateOfBirth: '2010-05-15', parentName: 'Robert Doe', parentPhone: '9876543210', admissionDate: '2020-04-01' },
        { id: 'S002', name: 'Jane Smith', email: 'jane@example.com', phone: '1234567891', class: 'Class 2', section: 'B', rollNumber: '201', status: 'Active', gender: 'Female', bloodGroup: 'A+', address: '456 Oak Ave', dateOfBirth: '2009-08-20', parentName: 'Mary Smith', parentPhone: '9876543211', admissionDate: '2019-04-01' },
        { id: 'S003', name: 'Mike Johnson', email: 'mike@example.com', phone: '1234567892', class: 'Class 3', section: 'A', rollNumber: '301', status: 'Active', gender: 'Male', bloodGroup: 'B+', address: '789 Pine Rd', dateOfBirth: '2008-12-10', parentName: 'David Johnson', parentPhone: '9876543212', admissionDate: '2018-04-01' },
        { id: 'S004', name: 'Emily Davis', email: 'emily@example.com', phone: '1234567893', class: 'Class 1', section: 'B', rollNumber: '102', status: 'Active', gender: 'Female', bloodGroup: 'AB+', address: '321 Elm St', dateOfBirth: '2010-03-25', parentName: 'Sarah Davis', parentPhone: '9876543213', admissionDate: '2020-04-01' },
        { id: 'S005', name: 'Chris Wilson', email: 'chris@example.com', phone: '1234567894', class: 'Class 2', section: 'A', rollNumber: '202', status: 'Inactive', gender: 'Male', bloodGroup: 'O-', address: '654 Maple Dr', dateOfBirth: '2009-11-05', parentName: 'Tom Wilson', parentPhone: '9876543214', admissionDate: '2019-04-01' }
    ];

    facultyData = [
        { id: 'F001', name: 'Dr. Sarah Williams', email: 'sarah.w@edutrack.com', phone: '5551234567', department: 'Science', subject: 'Physics', qualification: 'PhD', experience: '10 years', status: 'Active', joiningDate: '2015-06-01' },
        { id: 'F002', name: 'Prof. Michael Brown', email: 'michael.b@edutrack.com', phone: '5551234568', department: 'Mathematics', subject: 'Mathematics', qualification: 'M.Sc', experience: '8 years', status: 'Active', joiningDate: '2017-08-15' },
        { id: 'F003', name: 'Dr. Jennifer Taylor', email: 'jennifer.t@edutrack.com', phone: '5551234569', department: 'English', subject: 'English Literature', qualification: 'PhD', experience: '12 years', status: 'Active', joiningDate: '2013-04-10' },
        { id: 'F004', name: 'Mr. Robert Anderson', email: 'robert.a@edutrack.com', phone: '5551234570', department: 'Computer Science', subject: 'Programming', qualification: 'M.Tech', experience: '6 years', status: 'Active', joiningDate: '2019-01-20' }
    ];

    coursesData = [
        { id: 'C001', name: 'Mathematics', code: 'MATH101', credits: 4, faculty: 'Prof. Michael Brown', class: 'Class 1', description: 'Basic Mathematics', duration: '6 months' },
        { id: 'C002', name: 'Physics', code: 'PHY101', credits: 4, faculty: 'Dr. Sarah Williams', class: 'Class 2', description: 'Introduction to Physics', duration: '6 months' },
        { id: 'C003', name: 'English', code: 'ENG101', credits: 3, faculty: 'Dr. Jennifer Taylor', class: 'Class 1', description: 'English Literature', duration: '6 months' },
        { id: 'C004', name: 'Computer Science', code: 'CS101', credits: 4, faculty: 'Mr. Robert Anderson', class: 'Class 3', description: 'Programming Basics', duration: '6 months' }
    ];

    attendanceData = [
        { studentId: 'S001', studentName: 'John Doe', class: 'Class 1', date: '2024-01-15', status: 'Present', course: 'Mathematics' },
        { studentId: 'S002', studentName: 'Jane Smith', class: 'Class 2', date: '2024-01-15', status: 'Present', course: 'Physics' },
        { studentId: 'S003', studentName: 'Mike Johnson', class: 'Class 3', date: '2024-01-15', status: 'Absent', course: 'Computer Science' }
    ];

    gradesData = [
        { studentId: 'S001', studentName: 'John Doe', course: 'Mathematics', grade: 'A', percentage: 92, date: '2024-01-20' },
        { studentId: 'S002', studentName: 'Jane Smith', course: 'Physics', grade: 'A+', percentage: 95, date: '2024-01-20' },
        { studentId: 'S003', studentName: 'Mike Johnson', course: 'Computer Science', grade: 'B+', percentage: 87, date: '2024-01-20' },
        { studentId: 'S004', studentName: 'Emily Davis', course: 'English', grade: 'A', percentage: 90, date: '2024-01-20' }
    ];

    feesData = [
        { studentId: 'S001', studentName: 'John Doe', amount: 5000, paid: 5000, balance: 0, dueDate: '2024-02-01', status: 'Paid' },
        { studentId: 'S002', studentName: 'Jane Smith', amount: 5000, paid: 2500, balance: 2500, dueDate: '2024-02-01', status: 'Pending' },
        { studentId: 'S003', studentName: 'Mike Johnson', amount: 5000, paid: 5000, balance: 0, dueDate: '2024-02-01', status: 'Paid' },
        { studentId: 'S004', studentName: 'Emily Davis', amount: 5000, paid: 0, balance: 5000, dueDate: '2024-02-01', status: 'Pending' }
    ];

    activityLog = [
        { action: 'New student John Doe registered', time: '2 hours ago', type: 'student' },
        { action: 'Grade updated for Jane Smith in Physics', time: '3 hours ago', type: 'grade' },
        { action: 'Attendance marked for Class 3', time: '5 hours ago', type: 'attendance' },
        { action: 'Fee payment received from Mike Johnson', time: '1 day ago', type: 'fee' }
    ];

    saveToLocalStorage();
}

// ===== LOCAL STORAGE FUNCTIONS =====
function saveToLocalStorage() {
    localStorage.setItem('edutrack_students', JSON.stringify(studentsData));
    localStorage.setItem('edutrack_faculty', JSON.stringify(facultyData));
    localStorage.setItem('edutrack_courses', JSON.stringify(coursesData));
    localStorage.setItem('edutrack_attendance', JSON.stringify(attendanceData));
    localStorage.setItem('edutrack_grades', JSON.stringify(gradesData));
    localStorage.setItem('edutrack_fees', JSON.stringify(feesData));
    localStorage.setItem('edutrack_activity', JSON.stringify(activityLog));
}

function loadFromLocalStorage() {
    studentsData = JSON.parse(localStorage.getItem('edutrack_students')) || [];
    facultyData = JSON.parse(localStorage.getItem('edutrack_faculty')) || [];
    coursesData = JSON.parse(localStorage.getItem('edutrack_courses')) || [];
    attendanceData = JSON.parse(localStorage.getItem('edutrack_attendance')) || [];
    gradesData = JSON.parse(localStorage.getItem('edutrack_grades')) || [];
    feesData = JSON.parse(localStorage.getItem('edutrack_fees')) || [];
    activityLog = JSON.parse(localStorage.getItem('edutrack_activity')) || [];
}

// ===== AUTHENTICATION =====
function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const users = {
        'admin': { password: 'admin123', role: 'admin', name: 'Admin User' },
        'faculty': { password: 'faculty123', role: 'faculty', name: 'Faculty User' },
        'student': { password: 'student123', role: 'student', name: 'Student User', id: 'S001' }
    };

    if (users[username] && users[username].password === password) {
        currentUser = { username, ...users[username] };
        localStorage.setItem('edutrack_user', JSON.stringify(currentUser));
        showNotification('Login successful!', 'success');
        showDashboard(currentUser.role);
    } else {
        showNotification('Invalid credentials!', 'error');
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('edutrack_user');
    showPage('login-page');
    showNotification('Logged out successfully', 'info');
}

function checkAuth() {
    const savedUser = localStorage.getItem('edutrack_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showDashboard(currentUser.role);
    }
}

// ===== PAGE NAVIGATION =====
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

function showDashboard(role) {
    if (role === 'admin') {
        showPage('admin-dashboard');
        loadDashboardData();
    } else if (role === 'faculty') {
        showPage('faculty-dashboard');
        loadFacultyDashboard();
    } else if (role === 'student') {
        showPage('student-dashboard');
        loadStudentDashboard();
    }
}

function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));
    document.getElementById(sectionId + '-section').classList.add('active');
    
    document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
    event.target.closest('.menu-item').classList.add('active');

    if (sectionId === 'overview') loadDashboardData();
    if (sectionId === 'students') loadStudentsTable();
    if (sectionId === 'faculty') loadFacultyTable();
    if (sectionId === 'courses') loadCoursesGrid();
    if (sectionId === 'grades') loadGradesTable();
    if (sectionId === 'fees') loadFeesTable();
    if (sectionId === 'analytics') loadAnalytics();
}

// ===== DASHBOARD DATA =====
function loadDashboardData() {
    document.getElementById('total-students').textContent = studentsData.length;
    document.getElementById('total-faculty').textContent = facultyData.length;
    document.getElementById('total-courses').textContent = coursesData.length;
    
    const avgAttendance = attendanceData.length > 0 
        ? Math.round((attendanceData.filter(a => a.status === 'Present').length / attendanceData.length) * 100)
        : 0;
    document.getElementById('avg-attendance').textContent = avgAttendance + '%';

    loadActivityLog();
    loadOverviewChart();
}

function loadActivityLog() {
    const activityList = document.getElementById('activity-list');
    activityList.innerHTML = activityLog.map(activity => `
        <div class="activity-item">
            <p>${activity.action}</p>
            <small>${activity.time}</small>
        </div>
    `).join('');
}

// ===== STUDENTS MANAGEMENT =====
function loadStudentsTable() {
    const tbody = document.getElementById('students-tbody');
    tbody.innerHTML = studentsData.map(student => `
        <tr>
            <td><strong>${student.id}</strong></td>
            <td><strong>${student.name}</strong></td>
            <td>${student.email}</td>
            <td>${student.class}</td>
            <td>${student.section}</td>
            <td><span class="status-badge status-${student.status.toLowerCase()}">${student.status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn action-btn-view" onclick="viewStudent('${student.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn action-btn-edit" onclick="editStudent('${student.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn action-btn-delete" onclick="deleteStudent('${student.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function openAddStudentModal() {
    const modal = document.getElementById('modal');
    document.getElementById('modal-title').textContent = 'Add New Student';
    document.getElementById('modal-body').innerHTML = `
        <form id="student-form" onsubmit="saveStudent(event)">
            <div class="form-group">
                <label>Name *</label>
                <input type="text" name="name" required>
            </div>
            <div class="form-group">
                <label>Email *</label>
                <input type="email" name="email" required>
            </div>
            <div class="form-group">
                <label>Phone *</label>
                <input type="tel" name="phone" required>
            </div>
            <div class="form-group">
                <label>Class *</label>
                <select name="class" required>
                    <option value="">Select Class</option>
                    <option value="Class 1">Class 1</option>
                    <option value="Class 2">Class 2</option>
                    <option value="Class 3">Class 3</option>
                    <option value="Class 4">Class 4</option>
                    <option value="Class 5">Class 5</option>
                </select>
            </div>
            <div class="form-group">
                <label>Section *</label>
                <select name="section" required>
                    <option value="">Select Section</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                </select>
            </div>
            <div class="form-group">
                <label>Roll Number *</label>
                <input type="text" name="rollNumber" required>
            </div>
            <div class="form-group">
                <label>Gender</label>
                <select name="gender">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div class="form-group">
                <label>Blood Group</label>
                <input type="text" name="bloodGroup">
            </div>
            <div class="form-group">
                <label>Date of Birth</label>
                <input type="date" name="dateOfBirth">
            </div>
            <div class="form-group">
                <label>Parent Name</label>
                <input type="text" name="parentName">
            </div>
            <div class="form-group">
                <label>Parent Phone</label>
                <input type="tel" name="parentPhone">
            </div>
            <button type="submit" class="btn btn-primary btn-block">Add Student</button>
        </form>
    `;
    modal.classList.add('active');
}

function saveStudent(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newStudent = {
        id: 'S' + String(studentsData.length + 1).padStart(3, '0'),
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        class: formData.get('class'),
        section: formData.get('section'),
        rollNumber: formData.get('rollNumber'),
        gender: formData.get('gender'),
        bloodGroup: formData.get('bloodGroup'),
        dateOfBirth: formData.get('dateOfBirth'),
        parentName: formData.get('parentName'),
        parentPhone: formData.get('parentPhone'),
        status: 'Active',
        admissionDate: new Date().toISOString().split('T')[0]
    };
    
    studentsData.push(newStudent);
    saveToLocalStorage();
    logActivity(`New student ${newStudent.name} added`, 'student');
    showNotification('Student added successfully!', 'success');
    closeModal();
    loadStudentsTable();
}

function viewStudent(id) {
    const student = studentsData.find(s => s.id === id);
    if (!student) return;
    
    const modal = document.getElementById('modal');
    document.getElementById('modal-title').textContent = 'Student Details';
    document.getElementById('modal-body').innerHTML = `
        <div style="display: grid; gap: 16px;">
            <p><strong>ID:</strong> ${student.id}</p>
            <p><strong>Name:</strong> ${student.name}</p>
            <p><strong>Email:</strong> ${student.email}</p>
            <p><strong>Phone:</strong> ${student.phone}</p>
            <p><strong>Class:</strong> ${student.class}</p>
            <p><strong>Section:</strong> ${student.section}</p>
            <p><strong>Roll Number:</strong> ${student.rollNumber}</p>
            <p><strong>Gender:</strong> ${student.gender || 'N/A'}</p>
            <p><strong>Blood Group:</strong> ${student.bloodGroup || 'N/A'}</p>
            <p><strong>Date of Birth:</strong> ${student.dateOfBirth || 'N/A'}</p>
            <p><strong>Parent Name:</strong> ${student.parentName || 'N/A'}</p>
            <p><strong>Parent Phone:</strong> ${student.parentPhone || 'N/A'}</p>
            <p><strong>Status:</strong> <span class="status-badge status-${student.status.toLowerCase()}">${student.status}</span></p>
        </div>
    `;
    modal.classList.add('active');
}

function editStudent(id) {
    const student = studentsData.find(s => s.id === id);
    if (!student) return;
    
    const modal = document.getElementById('modal');
    document.getElementById('modal-title').textContent = 'Edit Student';
    document.getElementById('modal-body').innerHTML = `
        <form id="student-form" onsubmit="updateStudent(event, '${id}')">
            <div class="form-group">
                <label>Name *</label>
                <input type="text" name="name" value="${student.name}" required>
            </div>
            <div class="form-group">
                <label>Email *</label>
                <input type="email" name="email" value="${student.email}" required>
            </div>
            <div class="form-group">
                <label>Phone *</label>
                <input type="tel" name="phone" value="${student.phone}" required>
            </div>
            <div class="form-group">
                <label>Status *</label>
                <select name="status" required>
                    <option value="Active" ${student.status === 'Active' ? 'selected' : ''}>Active</option>
                    <option value="Inactive" ${student.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
                    <option value="Graduated" ${student.status === 'Graduated' ? 'selected' : ''}>Graduated</option>
                </select>
            </div>
            <button type="submit" class="btn btn-primary btn-block">Update Student</button>
        </form>
    `;
    modal.classList.add('active');
}

function updateStudent(event, id) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const index = studentsData.findIndex(s => s.id === id);
    if (index !== -1) {
        studentsData[index] = { ...studentsData[index], 
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            status: formData.get('status')
        };
        saveToLocalStorage();
        logActivity(`Student ${studentsData[index].name} updated`, 'student');
        showNotification('Student updated successfully!', 'success');
        closeModal();
        loadStudentsTable();
    }
}

function deleteStudent(id) {
    if (confirm('Are you sure you want to delete this student?')) {
        const student = studentsData.find(s => s.id === id);
        studentsData = studentsData.filter(s => s.id !== id);
        saveToLocalStorage();
        logActivity(`Student ${student.name} deleted`, 'student');
        showNotification('Student deleted successfully!', 'success');
        loadStudentsTable();
    }
}

// ===== FACULTY MANAGEMENT =====
function loadFacultyTable() {
    const tbody = document.getElementById('faculty-tbody');
    tbody.innerHTML = facultyData.map(faculty => `
        <tr>
            <td><strong>${faculty.id}</strong></td>
            <td><strong>${faculty.name}</strong></td>
            <td>${faculty.email}</td>
            <td>${faculty.department}</td>
            <td>${faculty.subject}</td>
            <td><span class="status-badge status-${faculty.status.toLowerCase()}">${faculty.status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn action-btn-edit" onclick="editFaculty('${faculty.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn action-btn-delete" onclick="deleteFaculty('${faculty.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function openAddFacultyModal() {
    const modal = document.getElementById('modal');
    document.getElementById('modal-title').textContent = 'Add New Faculty';
    document.getElementById('modal-body').innerHTML = `
        <form id="faculty-form" onsubmit="saveFaculty(event)">
            <div class="form-group">
                <label>Name *</label>
                <input type="text" name="name" required>
            </div>
            <div class="form-group">
                <label>Email *</label>
                <input type="email" name="email" required>
            </div>
            <div class="form-group">
                <label>Phone *</label>
                <input type="tel" name="phone" required>
            </div>
            <div class="form-group">
                <label>Department *</label>
                <input type="text" name="department" required>
            </div>
            <div class="form-group">
                <label>Subject *</label>
                <input type="text" name="subject" required>
            </div>
            <button type="submit" class="btn btn-primary btn-block">Add Faculty</button>
        </form>
    `;
    modal.classList.add('active');
}

function saveFaculty(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newFaculty = {
        id: 'F' + String(facultyData.length + 1).padStart(3, '0'),
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        department: formData.get('department'),
        subject: formData.get('subject'),
        status: 'Active',
        joiningDate: new Date().toISOString().split('T')[0]
    };
    
    facultyData.push(newFaculty);
    saveToLocalStorage();
    logActivity(`New faculty ${newFaculty.name} added`, 'faculty');
    showNotification('Faculty added successfully!', 'success');
    closeModal();
    loadFacultyTable();
}

function editFaculty(id) {
    showNotification('Edit faculty feature coming soon!', 'info');
}

function deleteFaculty(id) {
    if (confirm('Are you sure you want to delete this faculty?')) {
        const faculty = facultyData.find(f => f.id === id);
        facultyData = facultyData.filter(f => f.id !== id);
        saveToLocalStorage();
        logActivity(`Faculty ${faculty.name} deleted`, 'faculty');
        showNotification('Faculty deleted successfully!', 'success');
        loadFacultyTable();
    }
}

// ===== COURSES MANAGEMENT =====
function loadCoursesGrid() {
    const grid = document.getElementById('courses-grid');
    grid.innerHTML = coursesData.map(course => `
        <div class="course-card">
            <h3>${course.name}</h3>
            <p><strong>Code:</strong> ${course.code}</p>
            <p><strong>Faculty:</strong> ${course.faculty}</p>
            <p><strong>Class:</strong> ${course.class}</p>
            <p><strong>Credits:</strong> ${course.credits}</p>
            <p><strong>Duration:</strong> ${course.duration}</p>
            <div class="action-buttons" style="margin-top: 16px;">
                <button class="action-btn action-btn-edit" onclick="editCourse('${course.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn action-btn-delete" onclick="deleteCourse('${course.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function openAddCourseModal() {
    showNotification('Add course feature coming soon!', 'info');
}

function editCourse(id) {
    showNotification('Edit course feature coming soon!', 'info');
}

function deleteCourse(id) {
    showNotification('Delete course feature coming soon!', 'info');
}

// ===== GRADES MANAGEMENT =====
function loadGradesTable() {
    const tbody = document.getElementById('grades-tbody');
    tbody.innerHTML = gradesData.map(grade => `
        <tr>
            <td><strong>${grade.studentName}</strong></td>
            <td>${grade.course}</td>
            <td><span class="status-badge status-active">${grade.grade}</span></td>
            <td><strong>${grade.percentage}%</strong></td>
            <td>${grade.date}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn action-btn-edit" onclick="editGrade('${grade.studentId}', '${grade.course}')">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function editGrade(studentId, course) {
    showNotification('Edit grade feature coming soon!', 'info');
}

// ===== FEES MANAGEMENT =====
function loadFeesTable() {
    const tbody = document.getElementById('fees-tbody');
    tbody.innerHTML = feesData.map(fee => `
        <tr>
            <td><strong>${fee.studentName}</strong></td>
            <td><strong>$${fee.amount}</strong></td>
            <td><strong>$${fee.paid}</strong></td>
            <td><strong>$${fee.balance}</strong></td>
            <td>${fee.dueDate}</td>
            <td><span class="status-badge status-${fee.status.toLowerCase()}">${fee.status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn action-btn-view" onclick="viewFee('${fee.studentId}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function viewFee(studentId) {
    showNotification('View fee details coming soon!', 'info');
}

// ===== CHARTS =====
function loadOverviewChart() {
    const ctx = document.getElementById('overview-chart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Students', 'Faculty', 'Courses', 'Active'],
            datasets: [{
                label: 'Overview Statistics',
                data: [studentsData.length, facultyData.length, coursesData.length, studentsData.filter(s => s.status === 'Active').length],
                backgroundColor: [
                    'rgba(139, 92, 246, 0.7)',
                    'rgba(99, 102, 241, 0.7)',
                    'rgba(59, 130, 246, 0.7)',
                    'rgba(16, 185, 129, 0.7)'
                ],
                borderColor: [
                    'rgba(139, 92, 246, 1)',
                    'rgba(99, 102, 241, 1)',
                    'rgba(59, 130, 246, 1)',
                    'rgba(16, 185, 129, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { 
                    display: true,
                    labels: { color: '#e4e4e7', font: { size: 14, weight: 'bold' } }
                }
            },
            scales: {
                y: { 
                    beginAtZero: true,
                    ticks: { color: '#e4e4e7', font: { weight: 'bold' } },
                    grid: { color: 'rgba(139, 92, 246, 0.2)' }
                },
                x: { 
                    ticks: { color: '#e4e4e7', font: { weight: 'bold' } },
                    grid: { color: 'rgba(139, 92, 246, 0.2)' }
                }
            }
        }
    });
}

function loadAnalytics() {
    setTimeout(() => {
        loadPerformanceChart();
        loadAttendanceChart();
        loadFeesChart();
        loadDistributionChart();
    }, 100);
}

function loadPerformanceChart() {
    const ctx = document.getElementById('performance-chart');
    if (!ctx || ctx.chart) return;
    
    ctx.chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Average Performance',
                data: [75, 78, 82, 85, 88, 90],
                borderColor: 'rgba(139, 92, 246, 1)',
                backgroundColor: 'rgba(139, 92, 246, 0.2)',
                tension: 0.4,
                borderWidth: 3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { labels: { color: '#e4e4e7', font: { size: 13, weight: 'bold' } } }
            },
            scales: {
                y: { 
                    ticks: { color: '#e4e4e7', font: { weight: 'bold' } },
                    grid: { color: 'rgba(139, 92, 246, 0.2)' }
                },
                x: { 
                    ticks: { color: '#e4e4e7', font: { weight: 'bold' } },
                    grid: { color: 'rgba(139, 92, 246, 0.2)' }
                }
            }
        }
    });
}

function loadAttendanceChart() {
    const ctx = document.getElementById('attendance-chart');
    if (!ctx || ctx.chart) return;
    
    ctx.chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
                label: 'Attendance %',
                data: [92, 88, 95, 90],
                borderColor: 'rgba(16, 185, 129, 1)',
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                tension: 0.4,
                borderWidth: 3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { labels: { color: '#e4e4e7', font: { size: 13, weight: 'bold' } } }
            },
            scales: {
                y: { 
                    ticks: { color: '#e4e4e7', font: { weight: 'bold' } },
                    grid: { color: 'rgba(139, 92, 246, 0.2)' }
                },
                x: { 
                    ticks: { color: '#e4e4e7', font: { weight: 'bold' } },
                    grid: { color: 'rgba(139, 92, 246, 0.2)' }
                }
            }
        }
    });
}

function loadFeesChart() {
    const ctx = document.getElementById('fees-chart');
    if (!ctx || ctx.chart) return;
    
    const totalFees = feesData.reduce((sum, f) => sum + f.amount, 0);
    const paidFees = feesData.reduce((sum, f) => sum + f.paid, 0);
    const pendingFees = totalFees - paidFees;
    
    ctx.chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Paid', 'Pending'],
            datasets: [{
                data: [paidFees, pendingFees],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.7)',
                    'rgba(245, 158, 11, 0.7)'
                ],
                borderColor: [
                    'rgba(16, 185, 129, 1)',
                    'rgba(245, 158, 11, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { labels: { color: '#e4e4e7', font: { size: 13, weight: 'bold' } } }
            }
        }
    });
}

function loadDistributionChart() {
    const ctx = document.getElementById('distribution-chart');
    if (!ctx || ctx.chart) return;
    
    const classCounts = {};
    studentsData.forEach(s => {
        classCounts[s.class] = (classCounts[s.class] || 0) + 1;
    });
    
    ctx.chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(classCounts),
            datasets: [{
                data: Object.values(classCounts),
                backgroundColor: [
                    'rgba(139, 92, 246, 0.7)',
                    'rgba(99, 102, 241, 0.7)',
                    'rgba(59, 130, 246, 0.7)',
                    'rgba(16, 185, 129, 0.7)',
                    'rgba(245, 158, 11, 0.7)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { labels: { color: '#e4e4e7', font: { size: 13, weight: 'bold' } } }
            }
        }
    });
}

// ===== SEARCH & FILTER =====
document.addEventListener('DOMContentLoaded', function() {
    const studentSearch = document.getElementById('student-search');
    const classFilter = document.getElementById('class-filter');
    const statusFilter = document.getElementById('status-filter');
    
    if (studentSearch) {
        studentSearch.addEventListener('input', filterStudents);
    }
    if (classFilter) {
        classFilter.addEventListener('change', filterStudents);
    }
    if (statusFilter) {
        statusFilter.addEventListener('change', filterStudents);
    }
});

function filterStudents() {
    const searchTerm = document.getElementById('student-search')?.value.toLowerCase() || '';
    const classFilter = document.getElementById('class-filter')?.value || '';
    const statusFilter = document.getElementById('status-filter')?.value || '';
    
    let filtered = studentsData.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm) ||
                            student.email.toLowerCase().includes(searchTerm) ||
                            student.id.toLowerCase().includes(searchTerm);
        const matchesClass = !classFilter || student.class === classFilter;
        const matchesStatus = !statusFilter || student.status === statusFilter;
        
        return matchesSearch && matchesClass && matchesStatus;
    });
    
    const tbody = document.getElementById('students-tbody');
    tbody.innerHTML = filtered.map(student => `
        <tr>
            <td><strong>${student.id}</strong></td>
            <td><strong>${student.name}</strong></td>
            <td>${student.email}</td>
            <td>${student.class}</td>
            <td>${student.section}</td>
            <td><span class="status-badge status-${student.status.toLowerCase()}">${student.status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn action-btn-view" onclick="viewStudent('${student.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn action-btn-edit" onclick="editStudent('${student.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn action-btn-delete" onclick="deleteStudent('${student.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// ===== EXPORT FUNCTIONALITY =====
function exportStudents() {
    const csv = [
        ['ID', 'Name', 'Email', 'Phone', 'Class', 'Section', 'Status'],
        ...studentsData.map(s => [s.id, s.name, s.email, s.phone, s.class, s.section, s.status])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students.csv';
    a.click();
    showNotification('Students data exported successfully!', 'success');
}

// ===== FACULTY & STUDENT DASHBOARDS =====
function loadFacultyDashboard() {
    const classesDiv = document.getElementById('faculty-classes');
    classesDiv.innerHTML = coursesData.slice(0, 3).map(course => `
        <div class="course-card">
            <h3>${course.name}</h3>
            <p><strong>Code:</strong> ${course.code}</p>
            <p><strong>Class:</strong> ${course.class}</p>
            <button class="btn btn-primary" onclick="showNotification('Mark attendance coming soon!', 'info')">
                Mark Attendance
            </button>
        </div>
    `).join('');
}

function loadStudentDashboard() {
    const student = studentsData.find(s => s.id === currentUser.id);
    if (!student) return;
    
    const profileDiv = document.getElementById('student-profile-info');
    profileDiv.innerHTML = `
        <p><strong>Name:</strong> ${student.name}</p>
        <p><strong>Class:</strong> ${student.class} - ${student.section}</p>
        <p><strong>Roll Number:</strong> ${student.rollNumber}</p>
        <p><strong>Email:</strong> ${student.email}</p>
    `;
    
    const studentAttendance = attendanceData.filter(a => a.studentId === student.id);
    const presentCount = studentAttendance.filter(a => a.status === 'Present').length;
    const attendancePercent = studentAttendance.length > 0 ? Math.round((presentCount / studentAttendance.length) * 100) : 0;
    document.getElementById('student-attendance').textContent = attendancePercent + '%';
    
    const studentGrades = gradesData.filter(g => g.studentId === student.id);
    const avgGrade = studentGrades.length > 0 
        ? Math.round(studentGrades.reduce((sum, g) => sum + g.percentage, 0) / studentGrades.length)
        : 0;
    document.getElementById('student-grade').textContent = avgGrade + '%';
    
    const studentFee = feesData.find(f => f.studentId === student.id);
    document.getElementById('student-fees').textContent = studentFee ? '$' + studentFee.balance : '$0';
    
    const gradesDiv = document.getElementById('student-grades');
    gradesDiv.innerHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Course</th>
                    <th>Grade</th>
                    <th>Percentage</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                ${studentGrades.map(g => `
                    <tr>
                        <td><strong>${g.course}</strong></td>
                        <td><span class="status-badge status-active">${g.grade}</span></td>
                        <td><strong>${g.percentage}%</strong></td>
                        <td>${g.date}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// ===== ATTENDANCE MANAGEMENT =====
function loadAttendance() {
    const selectedClass = document.getElementById('attendance-class').value;
    const selectedDate = document.getElementById('attendance-date').value;
    
    if (!selectedClass || !selectedDate) {
        showNotification('Please select class and date', 'error');
        return;
    }
    
    const classStudents = studentsData.filter(s => s.class === selectedClass);
    const attendanceList = document.getElementById('attendance-list');
    
    attendanceList.innerHTML = classStudents.map(student => {
        const existing = attendanceData.find(a => 
            a.studentId === student.id && a.date === selectedDate
        );
        const status = existing ? existing.status : 'Present';
        
        return `
            <div class="attendance-item">
                <span>${student.name} (${student.rollNumber})</span>
                <div>
                    <button class="btn ${status === 'Present' ? 'btn-success' : 'btn-secondary'}" 
                            onclick="markAttendance('${student.id}', '${selectedDate}', 'Present')">
                        Present
                    </button>
                    <button class="btn ${status === 'Absent' ? 'btn-danger' : 'btn-secondary'}" 
                            onclick="markAttendance('${student.id}', '${selectedDate}', 'Absent')">
                        Absent
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function markAttendance(studentId, date, status) {
    const student = studentsData.find(s => s.id === studentId);
    const existingIndex = attendanceData.findIndex(a => 
        a.studentId === studentId && a.date === date
    );
    
    const record = {
        studentId,
        studentName: student.name,
        class: student.class,
        date,
        status,
        course: 'General'
    };
    
    if (existingIndex !== -1) {
        attendanceData[existingIndex] = record;
    } else {
        attendanceData.push(record);
    }
    
    saveToLocalStorage();
    logActivity(`Attendance marked for ${student.name}`, 'attendance');
    showNotification('Attendance marked successfully!', 'success');
    loadAttendance();
}

// ===== UTILITY FUNCTIONS =====
function closeModal() {
    document.getElementById('modal').classList.remove('active');
}

function togglePassword() {
    const passwordInput = document.getElementById('password');
    const icon = event.target;
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

function toggleDemoCredentials() {
    const demo = document.getElementById('demo-credentials');
    demo.style.display = demo.style.display === 'none' ? 'block' : 'none';
}

function fillCredentials(username, password) {
    document.getElementById('username').value = username;
    document.getElementById('password').value = password;
}

function showNotification(message, type = 'info') {
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <strong>${type.toUpperCase()}:</strong> ${message}
    `;
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.4s ease-out reverse';
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}

function logActivity(action, type) {
    activityLog.unshift({
        action,
        time: 'Just now',
        type
    });
    if (activityLog.length > 10) activityLog = activityLog.slice(0, 10);
    saveToLocalStorage();
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize data
    const hasData = localStorage.getItem('edutrack_students');
    if (!hasData) {
        initializeSampleData();
    } else {
        loadFromLocalStorage();
    }
    
    // Set up login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Set today's date for attendance
    const dateInput = document.getElementById('attendance-date');
    if (dateInput) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }
    
    // Check if user is already logged in
    checkAuth();
    
    // Close modal on outside click
    window.onclick = function(event) {
        const modal = document.getElementById('modal');
        if (event.target === modal) {
            closeModal();
        }
    };
});
