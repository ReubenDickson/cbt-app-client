// src/pages/ExamEngine.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box, VStack, HStack, Heading, Text, RadioGroup, Radio, Button, Progress, useToast, Container, Divider
} from '@chakra-ui/react';
import api from '../services/api';
import ExamTimer from '../components/ExamTimer';

const ExamEngine = () => {
  const { id: examId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [sessionData, setSessionData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // Stores answers as { questionId: "selected option string" }
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Retrieve the session data we saved during the "Start Exam" action
    const storedSession = sessionStorage.getItem('currentExamSession');
    if (storedSession) {
      setSessionData(JSON.parse(storedSession));
    } else {
      // Security measure: kick user back to dashboard if they bypass the start process
      toast({
        title: 'No active session.',
        description: 'Please start the exam from your dashboard.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      navigate('/dashboard');
    }
  }, [navigate, toast]);

  if (!sessionData) return null;

  const { examData, sessionId } = sessionData;
  const questions = examData.questions || [];
  const currentQuestion = questions[currentQuestionIndex];

  // Issue 8: Answer State Management
  const handleOptionChange = (value) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  // Issue 7: Navigation Handlers
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    // Format answers to match the backend expectation: [{ questionId, selectedOption }]
    const formattedAnswers = Object.keys(answers).map(qId => ({
      questionId: qId,
      selectedOption: answers[qId]
    }));

    setIsSubmitting(true);
    try {
       // Issue 10/Sprint 4: Submit Exam Action
       const response = await api.post(`/student-exams/${examId}/submit`, { answers: formattedAnswers });

       toast({
         title: 'Exam Submitted Successfully!',
         description: `You scored ${response.data.score} out of ${response.data.total}.`,
         status: 'success',
         duration: 7000,
         isClosable: true,
         position: 'top',
       });

       sessionStorage.removeItem('currentExamSession');
       navigate('/dashboard'); // We will build a dedicated Result view later

    } catch (error) {
       toast({
         title: 'Submission failed.',
         description: error.response?.data?.message || 'Check your connection and try again.',
         status: 'error',
         duration: 5000,
         isClosable: true,
         position: 'top',
       });
       setIsSubmitting(false);
    }
  };

  // Calculate progress bar percentage
  const progressValue = questions.length > 0 
    ? ((currentQuestionIndex + 1) / questions.length) * 100 
    : 0;

  return (
    <Container maxW="4xl" py={8}>
      <Box bg="white" p={8} borderRadius="xl" shadow="lg" borderWidth="1px">
        
        {/* Header Area */}
        <HStack justify="space-between" mb={6}>
          <VStack align="start" spacing={0}>
            <Heading size="md" color="blue.600">{examData.courseCode} - {examData.title}</Heading>
            <Text color="gray.500" fontSize="sm">Session Active</Text>
          </VStack>
          
          {/* Issue 9 Placeholder: Timer will go here */}
          <ExamTimer
          duration={examData.duration} // Duration in minutes
          sessionId={sessionId} // Unique session identifier for timer persistence
          onExpire={handleSubmit} // Auto-submit when time expires
          />
        </HStack>

        <Progress value={progressValue} size="sm" colorScheme="blue" mb={6} borderRadius="full" />

        {/* Question Area */}
        {questions.length > 0 ? (
          <Box mb={8} minH="250px">
            <Text fontWeight="bold" fontSize="lg" mb={4} color="gray.700">
              Question {currentQuestionIndex + 1} of {questions.length}
            </Text>
            <Text fontSize="xl" mb={6} fontWeight="medium">
              {currentQuestion?.questionText}
            </Text>

            <RadioGroup
              onChange={handleOptionChange}
              value={answers[currentQuestion?.id] || ''}
            >
              <VStack align="start" spacing={4}>
                {currentQuestion?.options.map((option, idx) => (
                  <Radio key={idx} value={option} colorScheme="blue" size="lg">
                    {option}
                  </Radio>
                ))}
              </VStack>
            </RadioGroup>
          </Box>
        ) : (
          <Text color="red.500">Error: No questions loaded for this exam.</Text>
        )}

        <Divider mb={6} />

        {/* Navigation Area */}
        <HStack justify="space-between">
          <Button
            onClick={handlePrev}
            isDisabled={currentQuestionIndex === 0}
            variant="outline"
            colorScheme="blue"
          >
            Previous
          </Button>

          {currentQuestionIndex === questions.length - 1 ? (
            <Button
              colorScheme="green"
              onClick={handleSubmit}
              isLoading={isSubmitting}
              loadingText="Submitting..."
              size="lg"
            >
              Submit Exam
            </Button>
          ) : (
            <Button colorScheme="blue" onClick={handleNext}>
              Next
            </Button>
          )}
        </HStack>
      </Box>
    </Container>
  );
};

export default ExamEngine;