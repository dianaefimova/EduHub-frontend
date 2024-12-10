// src/pages/Login.tsx
import React from 'react';
import { Box, Button, Flex, FormControl, FormLabel, Input, Heading, Image, VStack, useColorModeValue } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import ThemeToggleButton from '../components/ThemeToggleButton';
import logo from '../assets/1582638612_tampere-university-logo.png';
import students from '../data/students.json';
import teachers from '../data/teachers.json';
import { useUserContext } from '../context/UserContext';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const { setUser, setIsLoggedIn } = useUserContext();

  const handleLogin = () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // Check if the user is a student
    const student = students.find((u) => u.email === trimmedEmail && u.password === trimmedPassword);
    if (student) {
      setUser({ ...student, userType: 'student' });
      setIsLoggedIn(true);
      setError('');
      onLogin();
      navigate('/');
      return;
    }

    // Check if the user is a teacher
    const teacher = teachers.find((u) => u.email === trimmedEmail && u.password === trimmedPassword);
    if (teacher) {
      setUser({ ...teacher, userType: 'teacher' });
      setIsLoggedIn(true);
      setError('');
      onLogin();
      navigate('/');
      return;
    }

    // If neither student nor teacher is found, show an error
    setError('Invalid email or password');
  };

  // Set colors dynamically based on the color mode
  const bgColor = useColorModeValue('gray.100', 'gray.800');
  const leftColumnBgColor = useColorModeValue('brand.500', 'grey.800');
  const formBgColor = useColorModeValue('white', 'gray.800');
  const headingColor = useColorModeValue('brand.800', 'brand.300');

  return (
    <Flex minHeight="100vh" bg={bgColor}>
      {/* Left Column with Logo */}
      <Box 
        width="50%" 
        bg={leftColumnBgColor}
        display="flex" 
        alignItems="center" 
        justifyContent="center"
      >
        <Image src={logo} alt="Logo" boxSize="60%" objectFit="contain" />
      </Box>

      {/* Right Column with Login Form */}
      <Flex 
        width="50%" 
        alignItems="center" 
        justifyContent="center" 
        bg={formBgColor}
        p={8}
      >
        <Box width="100%" maxWidth="400px">
          {/* Dark Mode Toggle Button */}
          <Flex justifyContent="flex-end" mb={4}>
            <ThemeToggleButton />
          </Flex>

          {/* Login Form */}
          <VStack spacing={6}>
            <Heading as="h2" size="lg" textAlign="center" color={headingColor}>
              Log In
            </Heading>

            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input 
                type="email" 
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
               />
            </FormControl>

            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input 
                type="password" 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
            </FormControl>
              
              {/* Error Message */} 
              {error && (
                <Box color="red.500" textAlign="center">
                  {error}
                </Box>
              )}
            <Button colorScheme="brand" width="full" onClick={handleLogin}>
              Log In
            </Button>
          </VStack>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Login;
