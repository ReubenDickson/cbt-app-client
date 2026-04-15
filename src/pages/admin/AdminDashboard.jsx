// src/pages/admin/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Flex, VStack, Heading, Text, Button, Divider, useToast
} from '@chakra-ui/react';
import ExamCreator from './ExamCreator';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [adminName, setAdminName] = useState('Admin');

  // Retrieve the admin's name from localStorage on mount
  useEffect(() => {
    const storedData = localStorage.getItem('adminData');
    if (storedData) {
      setAdminName(JSON.parse(storedData).name);
    }
  }, []);

  const handleLogout = () => {
    // Clear the secure tokens
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    
    toast({
      title: 'Logged Out',
      description: 'You have been securely logged out.',
      status: 'info',
      duration: 3000,
      isClosable: true,
      position: 'top-right'
    });
    
    // Boot them back to the login screen
    navigate('/admin/login');
  };

  return (
    <Flex h="100vh" bg="gray.50">
      {/* Sidebar Navigation */}
      <Box w="250px" bg="blue.900" color="white" p={5} display="flex" flexDirection="column">
        <Heading size="md" mb={6} textAlign="center">CBT Admin Portal</Heading>
        <Divider mb={6} borderColor="blue.700" />
        
        <VStack align="stretch" spacing={2} flex="1">
          <Button variant="solid" colorScheme="blue" justifyContent="flex-start">
            Dashboard Home
          </Button>
          <Button variant="ghost" colorScheme="blue" color="gray.300" justifyContent="flex-start" _hover={{ bg: 'blue.800', color: 'white' }}>
            Manage Exams
          </Button>
          <Button variant="ghost" colorScheme="blue" color="gray.300" justifyContent="flex-start" _hover={{ bg: 'blue.800', color: 'white' }}>
            Student Results
          </Button>
        </VStack>

        <Divider mb={4} borderColor="blue.700" />
        <Button colorScheme="red" variant="solid" onClick={handleLogout} w="full">
          Sign Out
        </Button>
      </Box>

      {/* Main Content Area */}
      <Box flex="1" p={10} overflowY="auto">
        <Flex justify="space-between" align="center" mb={8}>
          <Heading size="lg" color="gray.800">Welcome, {adminName}</Heading>
        </Flex>

        <Box bg="white" p={8} borderRadius="xl" shadow="sm" borderWidth="1px">
          <Heading size="md" mb={4}>System Overview</Heading>
          <Text color="gray.600" mb={6}>
            Welcome to the command center. From here, you can schedule new examinations, populate test banks, and review student performance metrics.
          </Text>
          
          <Box p={6} bg="blue.50" borderRadius="md" borderStyle="dashed" borderWidth="2px" borderColor="blue.200">
            <ExamCreator />
          </Box>
        </Box>
      </Box>
    </Flex>
  );
};

export default AdminDashboard;