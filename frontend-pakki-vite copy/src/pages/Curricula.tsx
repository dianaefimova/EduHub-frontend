import { useEffect, useState } from 'react';
import { Box, Heading, Text, Spinner, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import axios from 'axios';
import { useUserContext } from '../context/UserContext';
import students from '../data/students.json';

interface Degree {
    id: number;
    name: string;
    level: string;
    years: number;
    credits: number;
    curriculum: Curriculum[];
}

interface Curriculum {
    course_id: string;
    course_name: string;
    credits: number;
}

interface ApiData {
    degrees: Degree[];
}

const Curricula = () => {
    const { user, isLoggedIn } = useUserContext(); // Use context to get the logged-in user
    const [degree, setDegree] = useState<Degree | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isLoggedIn || !user || user.userType !== 'student') {
            setError('Access restricted to students only.');
            setLoading(false);
            return;
        }

        const studentId = (user as Student).studentId;
        const student = students.find((s) => s.studentId === studentId);

        if (!student) {
            setError(`Student with ID ${studentId} not found.`);
            setLoading(false);
            return;
        }

        const degreeProgramId = student.degreeProgramId;

        axios
            .get<ApiData>('https://eduhub-render.onrender.com/public-api')
            .then((response) => {
                const matchingDegree = response.data.degrees.find(
                    (deg) => deg.id.toString() === degreeProgramId
                );

                if (matchingDegree) {
                    setDegree(matchingDegree);
                } else {
                    setError('No matching degree found for the given program ID.');
                }

                setLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching data:', err);
                setError('Error loading data.');
                setLoading(false);
            });
    }, [user, isLoggedIn]);

    return (
        <Box textAlign="center" fontSize="xl" p={4} minHeight="100vh" width="100%">
            {loading ? (
                <Spinner size="xl" mt={4} />
            ) : error ? (
                <Text color="red.500" mt={4}>
                    {error}
                </Text>
            ) : degree ? (
                <div>
                    <Heading>{degree.name}</Heading>
                    <Table variant="striped" mt={4}>
                        <Thead>
                            <Tr>
                                <Th>Level</Th>
                                <Th>Duration</Th>
                                <Th>Credits</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            <Tr>
                                <Td>{degree.level}</Td>
                                <Td>{degree.years} years</Td>
                                <Td>{degree.credits}</Td>
                            </Tr>
                        </Tbody>
                    </Table>

                    <Heading size="md" mt={6}>
                        Curriculum
                    </Heading>
                    <Table variant="striped" mt={4} border="1px" borderColor="gray.200">
                        <Thead>
                            <Tr>
                                <Th>Course</Th>
                                <Th>Credits</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {degree.curriculum.map((course) => (
                                <Tr key={course.course_id}>
                                    <Td>{course.course_name}</Td>
                                    <Td>{course.credits}</Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </div>
            ) : (
                <Text mt={4}>No data available.</Text>
            )}
        </Box>
    );
};

export default Curricula;
