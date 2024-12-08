import { useEffect, useState } from 'react';
import { Box, Heading, Text, Spinner, SimpleGrid, Card, CardBody, CardHeader } from '@chakra-ui/react';
import axios from 'axios';


interface Degree {
    name: string;
    duration_years: number;
    credits: number;
    language: string;

}


interface ApiData {
    degrees: Degree[];

}

const Degrees = () => {
    const [apiData, setApiData] = useState<ApiData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        axios.get<ApiData>('https://eduhub-render.onrender.com/public-api/degrees')
            .then((response) => {
                setApiData(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setError('Error loading data');
                setLoading(false);
            });
    }, []);

return (
        <Box
            textAlign="center"
            fontSize="xl"
            p={4}
            minHeight="100vh"
            width="100%"
        >
            <Text mt={4} mb={8}>
                Explore various degree programs
            </Text>
            {loading ? (
                <Spinner size="xl" mt={4} />
            ) : error ? (
                <Text color="red.500" mt={4}>{error}</Text>
            ) : apiData && apiData.degrees ? (
                <SimpleGrid columns={[1, 2, 3]} spacing={6} mt={4}>
                    {apiData.degrees.map((degree, index) => (

                        <Card key={index} boxShadow="lg" p="6" rounded="md" borderWidth="1px">
                            <CardHeader>
                                <Heading size="md">{degree.name}</Heading>
                            </CardHeader>
                            <CardBody>
                                <Text><strong>Duration:</strong> {degree.duration_years} years</Text>
                                <Text><strong>Credits:</strong> {degree.credits}</Text>
                                <Text><strong>Language:</strong> {degree.language.toUpperCase()}</Text>
                            </CardBody>
                        </Card>
                    ))}
                </SimpleGrid>
            ) : (
                <Text>No degrees available at the moment.</Text>
            )}
        </Box>
);};
export default Degrees;