// src/pages/Login.jsx
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
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    matricNumber: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const toast = useToast();
  const { login } = useAuth(); // Pull in our auth context

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Sending credentials to POST http://localhost:5000/api/auth/login
      const response = await api.post('/auth/login', formData);
      
      // Assuming the backend returns { token: "ey...", student: { ... } }
      const { token, student } = response.data;
      
      // Save token to localStorage and update global state
      login(token, student);

      toast({
        title: 'Login Successful.',
        description: "Welcome back to the CBT System.",
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });

      // Redirect to the protected dashboard
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Login Failed.',
        description: error.response?.data?.message || "Invalid credentials. Please try again.",
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
          <Heading size="lg">Student Login</Heading>
          <Text color="gray.500">Access your exams and results.</Text>

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Matriculation Number</FormLabel>
                <Input 
                  name="matricNumber" 
                  type="text"
                  value={formData.matricNumber} 
                  onChange={handleChange} 
                  placeholder="e.g ENG/2026/001" 
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input 
                  name="password" 
                  type="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  placeholder="Enter your password" 
                />
              </FormControl>

              <Button 
                type="submit" 
                colorScheme="blue" 
                w="full" 
                isLoading={isLoading}
                loadingText="Authenticating..."
              >
                Log In
              </Button>
            </VStack>
          </form>

          <Text fontSize="sm" w="full" textAlign="center">
            Don't have an account?{' '}
            <Link as={RouterLink} to="/register" color="blue.500" fontWeight="bold">
              Register here
            </Link>
          </Text>
        </VStack>
      </Box>
    </Container>
  );
};

export default Login;