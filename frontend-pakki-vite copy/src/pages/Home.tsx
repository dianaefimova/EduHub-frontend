import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Heading,
  Text,
  VStack,
  useColorModeValue,
  GridItem,
  Link,
  List,
  ListItem,
  LinkBox,
  LinkOverlay,
  Spinner,
} from '@chakra-ui/react';
import { Course, Degree, getDegreeById } from '../utils/fetchDegrees';
import Calendar from '../components/Calendar'; // Updated Calendar Component
import { Link as RouterLink } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';

const HomePage = () => {
  const { user, isLoggedIn } = useUserContext();
  const [degree, setDegree] = useState<Degree | null>(null);
  const bgColor = useColorModeValue('white', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const [loading, setLoading] = useState(true);

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
      } else if (user?.userType === 'teacher') {
        setLoading(false);
      }
    };
    fetchUserDegree();
  }, [user]);

  if (!isLoggedIn) {
    return <Text>Please log in to access your dashboard.</Text>;
  }

  if (loading) {
    return <Spinner size="xl" />;
  }

  // Format date of birth for display
  const formattedDOB =
    user?.userType === 'student'
      ? new Date(user.DOB).toLocaleDateString('gb-GB', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : 'N/A';

  // Determine attendance status if user is a student
  const attendanceStatus =
    user?.userType === 'student' && user?.attendance === 1
      ? 'Present'
      : 'Absent';

  // Calculate average grade for students
  const averageGrade =
    user?.userType === 'student' && user?.coursesCompleted.length > 0
      ? user?.coursesCompleted.reduce((sum, course) => sum + course.grade, 0) /
        user.coursesCompleted.length
      : null;

  return (
    <Box minHeight="100vh" bg={bgColor} p={6}>
      <Grid
        templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
        gap={6}
        alignItems="start"
      >
        {user?.userType === 'student' && (
          <GridItem>
            <Box bg={cardBg} p={6} borderRadius="md" minHeight="200px">
              <VStack align="center">
                <Text fontSize="md" color={textColor}>
                  {user.degreeProgram}
                </Text>
                <Heading size="lg" color="purple.400">
                  Credits
                </Heading>
                <Text fontSize="4xl" color={textColor}>
                  {user?.credits || 'N/A'}
                </Text>
              </VStack>
            </Box>
          </GridItem>
        )}

        {/* Personal Info */}
        <GridItem>
          <Box bg={cardBg} p={6} borderRadius="md" minHeight="200px">
            <VStack align="center">
              <Heading size="md" color="purple.400">
                {user?.name}
              </Heading>
              <Text fontSize="sm" color={textColor}>
                {user?.userType === 'student'
                  ? `Student ID: ${user.studentId}`
                  : `Teacher ID: ${user?.teacherId}`}
              </Text>
              <Text fontSize="sm" color={textColor}>
                Birthdate: {formattedDOB}
              </Text>
              {user?.userType === 'student' && (
                <Text fontSize="sm" color={textColor}>
                  Study Period: {user.studyPeriod}
                </Text>
              )}
            </VStack>
          </Box>
        </GridItem>

        {/* GPA Section */}
        {user?.userType === 'student' && degree && (
          <GridItem>
            <LinkBox bg={cardBg} p={6} borderRadius="md" minHeight="200px">
              <LinkOverlay as={RouterLink} to="/grades">
                <Heading size="lg" mb={2} color={textColor}>
                  G.P.A.: {averageGrade ? averageGrade.toFixed(2) : 'N/A'}
                </Heading>
                <VStack align="start" spacing={2}>
                  <Text fontSize="md" color={textColor}>Ongoing Courses:</Text>
                  {user.coursesOngoing.length > 0 ? (
                    user.coursesOngoing.map((courseId, index) => (
                      <Text key={index} fontSize="sm">
                        • {degree.curriculum.find(course => course.course_id === courseId)?.course_name || 'Unknown Course'}
                      </Text>
                    ))
                  ) : (
                    <Text fontSize="sm" color="gray.500">No ongoing courses</Text>
                  )}
                  <Text fontSize="sm" color="gray.500">Click to view detailed curriculum</Text>
                </VStack>
              </LinkOverlay>
            </LinkBox>
          </GridItem>
        )}

        {user?.userType === 'teacher' && (
          <GridItem>
            <Box bg={cardBg} p={6} borderRadius="md" minHeight="200px">
              <VStack align="center">
                <Heading size="md" color="purple.400">
                  Grades
                </Heading>
                <Text fontSize="sm" color={textColor}>
                  Grades are only available for student users.
                </Text>
              </VStack>
            </Box>
          </GridItem>
        )}

        {/* Calendar */}
        <GridItem rowSpan={{base: 1, md: 4}} colSpan={{ base: 1, md: 1 }}>
          <Box bg={cardBg} p={6} borderRadius="md" minHeight="200px">
            <Heading size="md" color="purple.400">
              Calendar
            </Heading>
            <Box mt={4}>
              <Calendar />
            </Box>
          </Box>
        </GridItem>

        {/* Reservations */}
        <GridItem>
          <Box bg={cardBg} p={6} borderRadius="md" minHeight="200px">
            <Heading size="md" mb={2} color="purple.400">
              Reservations
            </Heading>
            <VStack align="start" spacing={2}>
              {user?.reservations?.length > 0 ? (
                user.reservations.map((reservation) => (
                  <Box key={reservation.id}>
                    <Text fontSize="sm" color={textColor}>
                      {reservation.title}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {reservation.date}
                    </Text>
                  </Box>
                ))
              ) : (
                <Text fontSize="sm" color="gray.500">
                  No reservations available
                </Text>
              )}
              <Link as={RouterLink} to="/reservations" color="purple.400" fontSize="sm">
                View All Reservations
              </Link>
            </VStack>
          </Box>
        </GridItem>

        {user?.userType === 'student' && (
          <GridItem>
            <Box bg={cardBg} p={6} borderRadius="md" minHeight="200px">
              <VStack align="center">
                <Heading size="md" color="purple.400">
                  Attendance Status
                </Heading>
                <Text fontSize="sm" color={textColor}>
                  {attendanceStatus}
                </Text>
                <Link color="purple.400" fontSize="sm">
                  Update Attendance
                </Link>
              </VStack>
            </Box>
          </GridItem>
        )}
      </Grid>
    </Box>
  );
};

export default HomePage;