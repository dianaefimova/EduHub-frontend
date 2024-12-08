import { useEffect, useState } from 'react';
import { Box, Text, Spinner, Table, Thead, Tr, Th, Button } from '@chakra-ui/react';
import axios from 'axios';
import { useUserContext } from '../context/UserContext'; // Importing user context to get the current student

interface Reservation {
    classroomName: string;
    amountOfPeople: number;
    isReserved: boolean;
    reservedBy: string | null;
}

interface ApiReservations {
    reservations: Reservation[];
}

const Reservations = () => {
    const { user, isLoggedIn } = useUserContext();
    const [apiData, setApiData] = useState<ApiReservations | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const userId = user && 'studentId' in user ? user.studentId : null;

    // Fetch reservation data from the API
    useEffect(() => {
        if (!isLoggedIn) {
            setError("Please log in to manage reservations.");
            setLoading(false);
            return;
        }

        axios.get<ApiReservations>("https://eduhub-render.onrender.com/public-api/reservations")
            .then((response) => {
                setApiData(response.data);
                setLoading(false);
            })
            .catch(() => {
                setError('Error loading data');
                setLoading(false);
            });
    }, [isLoggedIn]);

    const handleToggleReservation = (reservation: Reservation) => {
        if (reservation.isReserved) {
            if (reservation.reservedBy !== userId) {
                alert('You can only cancel reservations you made.');
                return;
            }
    
            const updatedReservation = { ...reservation, isReserved: false, reservedBy: "" };
    
            // Update the reservation in the backend
            axios.put(`/public-api/reservation/${reservation.classroomName}`, updatedReservation)
                .then(() => {
                    setApiData((prevData) => {
                        if (prevData) {
                            const updatedReservations = prevData.reservations.map((res) =>
                                res.classroomName === reservation.classroomName
                                    ? { ...res, isReserved: updatedReservation.isReserved, reservedBy: updatedReservation.reservedBy }
                                    : res
                            );
                            return { reservations: updatedReservations };
                        }
                        return prevData;
                    });
                })
                .catch(() => {
                    setError('Error canceling reservation');
                });
        } else {
            // If not reserved, reserve the room
            const updatedReservation = { ...reservation, isReserved: true, reservedBy: userId };
    
            // Update the reservation on the backend
            axios.put(`/public-api/reservation/${reservation.classroomName}`, updatedReservation)
                .then(() => {
                    setApiData((prevData) => {
                        if (prevData) {
                            const updatedReservations = prevData.reservations.map((res) =>
                                res.classroomName === reservation.classroomName
                                    ? { ...res, isReserved: updatedReservation.isReserved, reservedBy: updatedReservation.reservedBy }
                                    : res
                            );
                            return { reservations: updatedReservations };
                        }
                        return prevData;
                    });
                })
                .catch(() => {
                    setError('Error reserving room');
                });
        }
    };

    return (
        <Box
            textAlign="center"
            fontSize="xl"
            p={4}
            minHeight="100vh"
            width="100%"
        >
            <h3>Reservations</h3>
            <br />

            {loading ? (
                <Spinner size="xl" mt={4} />
            ) : error ? (
                <Text color="red.500" mt={4}>{error}</Text>
            ) : apiData && apiData.reservations ? (
                <div>
                    {apiData.reservations.map((reservation, index) => (
                        <div key={index}>
                            <Table variant="striped" mt={4}>
                                <Thead>
                                    <Tr>
                                        <Th><strong>Classroom:</strong> {reservation.classroomName}</Th>
                                        <Th><strong>Capacity:</strong> {reservation.amountOfPeople} people</Th>
                                        <Th><strong>Status:</strong> {reservation.isReserved ? "Reserved" : "Available"}</Th>
                                        <Th>
                                            <Button
                                                onClick={() => handleToggleReservation(reservation)}
                                                isDisabled={reservation.isReserved && reservation.reservedBy !== userId}
                                                colorScheme={reservation.isReserved ? "red" : "green"}
                                            >
                                                {reservation.isReserved ? (reservation.reservedBy === userId ? "Cancel Reservation" : "Reserved") : "Reserve"}
                                            </Button>
                                        </Th>
                                    </Tr>
                                </Thead>
                            </Table>
                        </div>
                    ))}
                </div>
            ) : (
                <Text mt={4}>No data available.</Text>
            )}
        </Box>
    );
};

export default Reservations;
