import React from 'react';
import { Box, Heading, Text, Stack } from '@chakra-ui/react';

const Profile: React.FC = () => {
    const user = {
        name: "John Doe",
        email: "john.doe@example.com",
        bio: "Software developer with a passion for creating amazing applications."
    };

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
            <Heading mb={4}>Profile</Heading>
            <Stack spacing={3}>
                <Text>
                    <strong>Name:</strong> {user.name}
                </Text>
                <Text>
                    <strong>Email:</strong> {user.email}
                </Text>
                <Text>
                    <strong>Bio:</strong> {user.bio}
                </Text>
            </Stack>
        </Box>
    );
};

export default Profile;