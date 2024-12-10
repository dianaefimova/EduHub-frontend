import { useState, useEffect } from 'react';
import { Box, Text, Button, VStack, List, ListItem } from '@chakra-ui/react';
import { useUserContext } from '../context/UserContext';
import coursesData from '../data/courses.json';

const Calendar = () => {
  const { user } = useUserContext();
  const [isExpanded, setIsExpanded] = useState(false);
  const [calendarEntries, setCalendarEntries] = useState<{ day: string; events: string[] }[]>([]);

  useEffect(() => {
    if (user?.userType === 'student') {
      const ongoingCourses = user.coursesOngoing;
      const scheduleEntries: { day: string; events: string[] }[] = [];

      ongoingCourses.forEach((courseId) => {
        coursesData.degrees.forEach((degree) => {
          degree.curriculum.forEach((course) => {
            if (course.course_id === courseId) {
              const [day, time] = course.schedule.split(' ');
              const existingEntry = scheduleEntries.find((entry) => entry.day === day);
              if (existingEntry) {
                existingEntry.events.push(`${course.course_name}: ${time}`);
              } else {
                scheduleEntries.push({ day, events: [`${course.course_name}: ${time}`] });
              }
            }
          });
        });
      });

      setCalendarEntries(scheduleEntries);
    }
  }, [user]);

  const visibleEntries = isExpanded ? calendarEntries : calendarEntries.slice(0, 1);

  return (
    <Box>
      <VStack align="start" spacing={4}>
        {visibleEntries.map((entry, index) => (
          <Box key={index}>
            <Text fontSize="md" fontWeight="bold">
              {entry.day}
            </Text>
            <List spacing={1}>
              {entry.events.map((event, eventIndex) => (
                <ListItem key={eventIndex} fontSize="sm" color="gray.400">
                  {event}
                </ListItem>
              ))}
            </List>
          </Box>
        ))}
        <Button
          size="sm"
          colorScheme="brand"
          variant="link"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'View Less' : 'View More'}
        </Button>
      </VStack>
    </Box>
  );
};

export default Calendar;