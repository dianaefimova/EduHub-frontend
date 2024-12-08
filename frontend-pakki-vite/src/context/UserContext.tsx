// src/context/UserContext.tsx
import React, { createContext, useContext, useState } from 'react';
import students from '../data/students.json';
import teachers from '../data/teachers.json';

// Define the types for Student and Teacher
export interface Student {
  studentId: string;
  email: string;
  password: string;
  name: string;
  DOB: string;
  degreeProgramId: string;
  studyPeriod: string;
  credits: number;
  attendance: number;
  coursesCompleted: {
    courseId: string;
    grade: number;
  }[];
  coursesOngoing: string[];
  userType: 'student';
}

interface Teacher {
  teacherId: string;
  email: string;
  name: string;
  userType: 'teacher';
  coursesTeaching: {
    courseId: string;
    students: string[];
  }[];
}

// Define a User type that could be either a Student or a Teacher
type User = Student | Teacher | null;

interface UserContextType {
  user: User;
  isLoggedIn: boolean;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

// Create the UserContext
const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

// UserProvider component
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Login function
  const login = (email: string, password: string): boolean => {
    // Check if the email and password match a student
    const student = students.find((student) => student.email === email && student.password === password);
    if (student) {
      setUser({
              studentId: student.studentId,
              email: student.email,
              password: student.password,
              name: student.name,
              DOB: student.DOB,
              degreeProgramId: student.degreeProgramId,
              studyPeriod: student.studyPeriod,
              credits: student.credits,
              attendance: student.attendance,
              coursesCompleted: student.coursesCompleted,
              coursesOngoing: student.coursesOngoing,
              userType: 'student',
            });
      setIsLoggedIn(true);
      return true;
    }

    // Check if the email and password match a teacher
    const teacher = teachers.find((teacher) => teacher.email === email && teacher.password === password);
    if (teacher) {
      setUser({
        teacherId: teacher.teacherId,
        email: teacher.email,
        name: teacher.name,
        userType: 'teacher',
        coursesTeaching: teacher.coursesTeaching,
      });
      setIsLoggedIn(true);
      return true;
    }

    // If no match found, return false
    return false;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <UserContext.Provider value={{ user, setUser, isLoggedIn, setIsLoggedIn, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
