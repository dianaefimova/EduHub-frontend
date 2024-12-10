import { useEffect, useState } from 'react';
import { Box, Text, Spinner, Table, Thead, Tr, Th, Button } from '@chakra-ui/react';
import { database } from "../firebase";
import { ref, get, update } from "firebase/database";

interface Reservation {
  classroomName: string;
  amountOfPeople: number;
  isReserved: boolean;
  reservedBy: string | null;
}

const Reservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const userId = "current-user-id"; 

  // Fetch the reservation data from Firebase on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dbRef = ref(database, "reservations"); 
        const snapshot = await get(dbRef); 
        if (snapshot.exists()) {
          const data = snapshot.val();
          const reservationArray = Object.keys(data).map((key) => data[key]);
          setReservations(reservationArray); 
        } else {
          setError("No data available.");
        }
      } catch (error) {
        setError("Error fetching data from Firebase.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to toggle reservation status
  const handleToggleReservation = async (reservation: Reservation) => {
    const dbRef = ref(database, `reservations/${reservation.classroomName}`);

    // If the room is already reserved, check if the user is the one who reserved it
    if (reservation.isReserved) {
      if (reservation.reservedBy !== userId) {
        alert('You can only cancel reservations you made.');
        return;
      }

      // Update the reservation status to unreserved
      const updatedReservation = { ...reservation, isReserved: false, reservedBy: null };
      await update(dbRef, updatedReservation); // Update the data in Firebase
      setReservations((prevReservations) =>
        prevReservations.map((res) =>
          res.classroomName === reservation.classroomName ? updatedReservation : res
        )
      );
    } else {
      // If the room is not reserved, reserve it
      const updatedReservation = { ...reservation, isReserved: true, reservedBy: userId };
      await update(dbRef, updatedReservation); // Update the data in Firebase
      setReservations((prevReservations) =>
        prevReservations.map((res) =>
          res.classroomName === reservation.classroomName ? updatedReservation : res
        )
      );
    }
  };

  return (
    <Box textAlign="center" fontSize="xl" p={4} minHeight="100vh" width="100%">
      <h3>Reservations</h3>
      <br />
      {loading ? (
        <Spinner size="xl" mt={4} />
      ) : error ? (
        <Text color="red.500" mt={4}>
          {error}
        </Text>
      ) : (
        <Table variant="striped" mt={4}>
          <Thead>
            <Tr>
              <Th>Classroom</Th>
              <Th>Capacity</Th>
              <Th>Status</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <tbody>
            {reservations.map((reservation, index) => (
              <Tr key={index}>
                <Th>{reservation.classroomName}</Th>
                <Th>{reservation.amountOfPeople} people</Th>
                <Th>{reservation.isReserved ? "Reserved" : "Available"}</Th>
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
            ))}
          </tbody>
        </Table>
      )}
    </Box>
  );
};

export default Reservations;
