import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Stack,
  Input,
  Textarea,
  Button,
  FormControl,
  FormLabel,
  Image,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import { useUserContext } from '../context/UserContext';

// Mock data and mock APIs
import students from '../data/students.json'; // Static user data
import teachers from '../data/teachers.json'; // Static teacher data
import { fetchUserDetails, saveUserDetails } from '../utils/api'; // Dynamic user-specific data

const Profile: React.FC = () => {
  const { user } = useUserContext();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    bio: '',
    picture: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      try {
        let userData;
        if (user?.userType === 'student') {
          // Fetch user from students.json
          userData = students.find((s) => s.studentId === user?.studentId);
          if (!userData) throw new Error('User not found in students.json');
        } else if (user?.userType === 'teacher') {
          // Fetch user from teachers.json
          userData = teachers.find((t) => t.teacherId === user?.teacherId);
          if (!userData) throw new Error('User not found in teachers.json');
        }

        // Fetch additional user details (dynamic data)
        const userDetails = await fetchUserDetails(user?.userType === 'student' ? user?.studentId : user?.teacherId);

        // Merge data from both sources
        setProfileData({
          name: userData.name,
          email: userData.email,
          bio: userDetails?.bio || '',
          picture: userDetails?.picture || '',
        });
      } catch (error) {
        toast({
          title: 'Error loading profile',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    if (user?.studentId || user?.teacherId) loadUserData();
  }, [user, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileData((prev) => ({ ...prev, picture: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveUserDetails(user?.userType === 'student' ? user?.studentId : user?.teacherId, {
        bio: profileData.bio,
        picture: profileData.picture,
      });
      toast({
        title: 'Profile saved',
        description: 'Your profile has been successfully updated.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error saving profile',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner size="xl" />;

  return (
    <Box
      textAlign="left"
      fontSize="xl"
      p={4}
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="100%"
    >
      <Heading mb={4}>Profile</Heading>
      <Stack spacing={3} width="100%" maxWidth="400px">
        {profileData.picture && (
          <Image
            src={profileData.picture}
            alt="Profile Picture"
            borderRadius="full"
            boxSize="150px"
            objectFit="cover"
            mb={4}
          />
        )}
        <FormControl>
          <FormLabel htmlFor="picture">Profile Picture</FormLabel>
          <Input id="picture" type="file" accept="image/*" onChange={handleImageUpload} />
        </FormControl>
        <FormControl isReadOnly>
          <FormLabel htmlFor="name">Name</FormLabel>
          <Input id="name" name="name" value={profileData.name} readOnly />
        </FormControl>
        <FormControl isReadOnly>
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input id="email" name="email" value={profileData.email} readOnly />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="bio">Bio</FormLabel>
          <Textarea
            id="bio"
            name="bio"
            value={profileData.bio}
            onChange={handleChange}
          />
        </FormControl>
        <Button
          colorScheme="blue"
          mt={4}
          onClick={handleSave}
          isLoading={saving}
        >
          Save Changes
        </Button>
      </Stack>
    </Box>
  );
};

export default Profile;