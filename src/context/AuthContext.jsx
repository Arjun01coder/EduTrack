import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Demo users for different roles
  const demoUsers = {
    admin: {
      id: 1,
      username: 'admin',
      password: 'admin123',
      role: 'admin',
      name: 'John Admin',
      email: 'admin@edutrack.com'
    },
    faculty: {
      id: 2,
      username: 'faculty',
      password: 'faculty123',
      role: 'faculty',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@edutrack.com',
      department: 'Computer Science',
      subjects: ['Data Structures', 'Web Development', 'Database Systems']
    },
    student: {
      id: 3,
      username: 'student',
      password: 'student123',
      role: 'student',
      name: 'Mike Wilson',
      email: 'mike.wilson@student.edutrack.com',
      studentId: 'STU001',
      class: '10th Grade',
      section: 'A',
      rollNumber: '001'
    }
  };

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('edutrack_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    // Find user in demo users
    const foundUser = Object.values(demoUsers).find(
      user => user.username === username && user.password === password
    );

    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('edutrack_user', JSON.stringify(userWithoutPassword));
      return { success: true, user: userWithoutPassword };
    } else {
      return { success: false, message: 'Invalid username or password' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('edutrack_user');
  };

  const value = {
    user,
    login,
    logout,
    loading,
    demoUsers
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
