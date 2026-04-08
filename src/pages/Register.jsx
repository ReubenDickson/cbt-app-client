// src/pages/Register.jsx
import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Link,
  useToast,
  Container
} from '@chakra-ui/react';
import api from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    matricNumber: '', // Assuming standard university ID format based on the prompt
    email: '', // Optional, can be used for future features like password reset
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Sending data to POST http://localhost:5000/api/auth/register
      await api.post('/auth/register', formData);
      
      toast({
        title: 'Registration Successful.',
        description: "Your account has been created. Please log in.",
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });

      // Redirect to login page upon success
      navigate('/login');
    } catch (error) {
      toast({
        title: 'Registration Failed.',
        description: error.response?.data?.message || "Something went wrong. Please try again.",
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="md" centerContent py={12}>
      <Box w="full" p={8} borderWidth={1} borderRadius="lg" boxShadow="lg" bg="white">
        <VStack spacing={4} align="flex-start" w="full">
          <Heading size="lg">Student Registration</Heading>
          <Text color="gray.500">Create an account to access the CBT system.</Text>

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Full Name</FormLabel>
                <Input 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  placeholder="John Doe" 
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Email Address</FormLabel>
                <Input 
                  name="email" 
                  type="email"
                  value={formData.email} 
                  onChange={handleChange} 
                  placeholder="student@university.edu" 
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Matriculation Number</FormLabel>
                <Input 
                  name="matricNumber" 
                  value={formData.matricNumber} 
                  onChange={handleChange} 
                  placeholder="e.g. ENG/2026/001" 
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input 
                  name="password" 
                  type="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  placeholder="Enter a secure password" 
                />
              </FormControl>

              <Button 
                type="submit" 
                colorScheme="blue" 
                w="full" 
                isLoading={isLoading}
                loadingText="Registering..."
              >
                Register
              </Button>
            </VStack>
          </form>

          <Text fontSize="sm" w="full" textAlign="center">
            Already have an account?{' '}
            <Link as={RouterLink} to="/login" color="blue.500" fontWeight="bold">
              Log in here
            </Link>
          </Text>
        </VStack>
      </Box>
    </Container>
  );
};

export default Register;