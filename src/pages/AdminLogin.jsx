// src/pages/admin/AdminLogin.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, FormControl, FormLabel, Input, Heading, VStack, useToast, Container, Text
} from '@chakra-ui/react';
import api from '../services/api';

const AdminLogin = () => {
  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post('/admin/login', { staffId, password });
      
      // Save the admin token separately from the student token to prevent session conflicts
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminData', JSON.stringify(response.data.admin));

      toast({
        title: 'Welcome Back!',
        description: `Logged in as ${response.data.admin.name}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right'
      });

      navigate('/admin/dashboard');
    } catch (error) {
      toast({
        title: 'Authentication Failed',
        description: error.response?.data?.message || 'Invalid Staff ID or Password.',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top-right'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="md" centerContent py={16}>
      <Box w="full" p={8} borderWidth="1px" borderRadius="xl" shadow="2xl" bg="white">
        <VStack spacing={6} as="form" onSubmit={handleSubmit}>
          <Heading size="lg" color="blue.700">Admin Portal</Heading>
          <Text color="gray.500" textAlign="center">
            Sign in to manage exams, questions, and student records.
          </Text>

          <FormControl id="staffId" isRequired>
            <FormLabel>Staff ID</FormLabel>
            <Input 
              type="text" 
              value={staffId} 
              onChange={(e) => setStaffId(e.target.value)} 
              placeholder="e.g., ADM001" 
              size="lg"
            />
          </FormControl>

          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Enter your password"
              size="lg"
            />
          </FormControl>

          <Button 
            type="submit" 
            colorScheme="blue" 
            size="lg" 
            w="full" 
            isLoading={isLoading}
            loadingText="Authenticating..."
          >
            Sign In
          </Button>
        </VStack>
      </Box>
    </Container>
  );
};

export default AdminLogin;