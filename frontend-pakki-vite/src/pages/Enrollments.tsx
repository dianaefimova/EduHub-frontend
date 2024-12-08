import { Box, Heading, Text } from '@chakra-ui/react';

const Enrollments = () => {
    return (
        <Box
        textAlign="left" 
            fontSize="xl" 
            p={4}
            minHeight='100vh'
            display="flex"
            flexDirection="column"
            alignItems="center"
            width="100%"
            >
            <Heading>
                Enrollments
            </Heading>
            <Text mt={4}>
          In this part there will be a calendar, plus some tabs to go to the different sections of the app
        </Text>
        </Box>
    );
}

export default Enrollments;