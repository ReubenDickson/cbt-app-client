// src/pages/ResultView.jsx
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box, VStack, Heading, Text, Button, CircularProgress, CircularProgressLabel, Container, Icon, Divider
} from '@chakra-ui/react';
// If you have react-icons installed, this looks great. If not, you can remove the Icon import.
import { CheckCircleIcon } from '@chakra-ui/icons'; 

const ResultView = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract the state passed from ExamEngine's navigate() function
  const { score, total, examTitle } = location.state || {};

  // Security fallback: If a user tries to type /result directly into the URL bar
  if (score === undefined || total === undefined) {
    return (
      <Container centerContent py={12}>
        <Box p={8} bg="white" borderRadius="lg" shadow="md" textAlign="center">
          <Heading size="md" color="red.500" mb={4}>No Result Data Found</Heading>
          <Text mb={6}>Please complete an exam to view your results.</Text>
          <Button colorScheme="blue" onClick={() => navigate('/dashboard')}>
            Return to Dashboard
          </Button>
        </Box>
      </Container>
    );
  }

  const percentage = Math.round((score / total) * 100);
  
  // Determine color based on pass/fail (assuming 50% is a pass)
  const isPassing = percentage >= 50;
  const progressColor = isPassing ? "green.400" : "red.400";

  return (
    <Container maxW="lg" centerContent py={12}>
      <Box w="full" p={8} bg="white" borderRadius="xl" shadow="xl" borderWidth="1px" textAlign="center">
        <VStack spacing={6}>
          <CheckCircleIcon w={12} h={12} color="green.500" />
          
          <Heading size="lg">Exam Submitted</Heading>
          <Text color="gray.600" fontWeight="medium">
            {examTitle || "Your exam"} has been successfully recorded.
          </Text>

          <Divider />

          <Box py={4}>
            <CircularProgress value={percentage} size="160px" thickness="8px" color={progressColor}>
              <CircularProgressLabel fontSize="2xl" fontWeight="bold">
                {percentage}%
              </CircularProgressLabel>
            </CircularProgress>
          </Box>

          <VStack spacing={1}>
            <Text fontSize="2xl" fontWeight="bold">
              Score: {score} / {total}
            </Text>
            <Text fontSize="sm" color="gray.500">
              A copy of your result has been sent to your registered email address.
            </Text>
          </VStack>

          <Button 
            colorScheme="blue" 
            size="lg" 
            w="full" 
            mt={4} 
            onClick={() => navigate('/dashboard')}
          >
            Return to Dashboard
          </Button>
        </VStack>
      </Box>
    </Container>
  );
};

export default ResultView;