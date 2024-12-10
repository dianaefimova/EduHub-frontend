import React from "react";
import {
  Box,
  Divider,
  Flex,
  Heading,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useUserContext } from "../context/UserContext";
import { Student } from "../context/UserContext"; // Assuming you have a types file
import { Course, Degree, fetchCourseName, getDegreeById } from '../utils/fetchDegrees';
import { useEffect, useState } from 'react';


const Grades: React.FC = () => {
  const { user } = useUserContext();
  const [loading, setLoading] = useState(true);
  const [degree, setDegree] = useState<Degree | null>(null);

  useEffect(() => {
    // Fetch degree data for the user if they are a student
    const fetchUserDegree = async () => {
      if (user?.userType === 'student') {
        setLoading(true);
        try {
          console.log(user.degreeProgramId);
          const userDegree = await getDegreeById(Number(user.degreeProgramId));
          console.log(user.degreeProgramId);
          console.log('userDegree:', userDegree);
          setDegree(userDegree);
        } catch (error) {
          console.error("Error fetching degree data:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchUserDegree();
  }, [user]);

  // const degree: Degree = await getDegreeById(user.degreeProgramId);
  
  // Type guard to ensure user is a Student
  const isStudent = (user: any): user is Student => user?.userType === "student";

  if (!isStudent(user)) {
    return <Text>Please log in as a student to view your grades.</Text>;
  }

  const getCourseStatus = (courseId: string) => {
    const completedCourse = user.coursesCompleted.find(
      (c) => c.courseId === courseId
    );
    if (completedCourse) return `Grade: ${completedCourse.grade}`;
    if (user.coursesOngoing.includes(courseId)) return "Ongoing";
    return "Not Started";
  };

  const textColor = useColorModeValue("brand.800", "brand.200");
  const itemBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Box p={8} minHeight="100vh">
      <Heading mb={4} textAlign="left">
        My Courses
      </Heading>

      <Text textAlign="left" fontSize="lg" fontWeight="semibold" color={textColor}>
        {user.name}
      </Text>
      <Text textAlign="left" fontSize="sm" color="gray.500">
        Student ID: {user.studentId}
      </Text>

      <Text textAlign="left" fontSize="sm" color="gray.500" mb={4}>
        {"Degree Courses"}
      </Text>
      <VStack spacing={4} align="stretch">
        {degree && degree.curriculum.map((course, index) => {
          const courseName = course.course_name;
          const courseStatus = getCourseStatus(course.course_id);

          return (
            <Box
              key={course.course_id}
              p={4}
              bg={itemBg}
              borderWidth="1px"
              borderRadius="md"
              borderColor={borderColor}
              boxShadow="sm"
            >
              <Flex justify="space-between" alignItems="center">
                <Text fontSize="lg" fontWeight="bold" color={textColor}>
                  {courseName || "Unknown Course"}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {courseStatus}
                </Text>
              </Flex>
              {degree && index < degree.curriculum.length - 1 && <Divider mt={4} />}
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
};

export default Grades;