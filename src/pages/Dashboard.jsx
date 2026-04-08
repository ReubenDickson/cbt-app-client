// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Spinner,
  Center,
  VStack,
  Badge,
  useToast
} from '@chakra-ui/react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [exams, setExams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startingExamId, setStartingExamId] = useState(null);
  
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth(); // We can use this to greet the student if needed

  useEffect(() => {
    const fetchExams = async () => {
      try {
        // Perfectly mapped to app.js: '/api/student-exams' + router.get('/today')
        const response = await api.get('/student-exams/today'); 
        
        // The backend returns the array directly
        setExams(response.data); 
      } catch (error) {
        toast({
          title: 'Error fetching exams.',
          description: error.response?.data?.message || 'Check your network connection.',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchExams();
  }, [toast]);

  const handleStartExam = async (examId) => {
    setStartingExamId(examId);
    try {
      // Perfectly mapped to app.js: '/api/student-exams' + router.post('/:id/start')
      const response = await api.post(`/student-exams/${examId}/start`);
      
      // The backend returns the exam details and sessionId.
      // We should store this in sessionStorage so the Exam Engine can access it easily 
      // without needing to make another network request or complex global state.
      sessionStorage.setItem('currentExamSession', JSON.stringify({
         sessionId: response.data.sessionId,
         examData: response.data.exam
      }));

      toast({
        title: 'Session Started.',
        description: 'Good luck on your exam!',
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'top',
      });

      // Navigate to the actual exam engine (We will build this in Sprint 3)
      navigate(`/exam/${examId}`);
    } catch (error) {
      toast({
        title: 'Cannot start exam.',
        description: error.response?.data?.message || 'You may have already taken this exam.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      setStartingExamId(null);
    }
  };

  if (isLoading) {
    return (
      <Center h="100vh">
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text>Loading today's exams...</Text>
        </VStack>
      </Center>
    );
  }

  return (
    <Box p={8} maxW="7xl" mx="auto">
      <Heading mb={2}>Student Dashboard</Heading>
      <Text color="gray.600" mb={8}>
        Select an available exam below to begin. Note: Once you start, the timer cannot be paused.
      </Text>

      {exams.length === 0 ? (
        <Center p={10} borderWidth={1} borderRadius="lg" bg="white" borderStyle="dashed">
          <Text fontSize="lg" color="gray.500">No exams are currently available for you today.</Text>
        </Center>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {exams.map((exam) => (
            <Card key={exam._id} shadow="md" borderWidth="1px">
              <CardHeader pb={2}>
                <Badge colorScheme="blue" mb={2}>{exam.courseCode}</Badge>
                <Heading size="md">{exam.title}</Heading>
              </CardHeader>
              <CardBody pt={2} pb={4}>
                <VStack align="start" spacing={2} fontSize="sm" color="gray.600">
                  <Text>
                    <strong>Date:</strong> {new Date(exam.date).toLocaleDateString()}
                  </Text>
                  <Text>
                    <strong>Time window:</strong> {exam.startTime} - {exam.endTime}
                  </Text>
                  <Text>
                    <strong>Duration:</strong> {exam.duration} minutes
                  </Text>
                  {/* Note: In your getTodaysExams controller, you used .select("-questions") 
                      so exam.questions will be undefined here. This is good for payload size! */}
                </VStack>
              </CardBody>
              <CardFooter pt={0}>
                <Button 
                  w="full" 
                  colorScheme="green" 
                  onClick={() => handleStartExam(exam._id)}
                  isLoading={startingExamId === exam._id}
                  loadingText="Starting..."
                >
                  Start Exam
                </Button>
              </CardFooter>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default Dashboard;