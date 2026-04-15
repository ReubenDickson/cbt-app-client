// src/pages/admin/ExamCreator.jsx
import { useState } from 'react';
import {
  Box, Button, FormControl, FormLabel, Input, VStack, Heading, 
  useToast, SimpleGrid, Textarea, FormHelperText
} from '@chakra-ui/react';
// CHANGE 1: We import raw axios instead of our custom api interceptor
import axios from 'axios'; 

const ExamCreator = () => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    courseCode: '',
    date: '',
    startTime: '',
    endTime: '',
    duration: 60,
    questionIds: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🚀 Submit button was clicked! Payload:", formData);
    setIsLoading(true);

    try {
      const adminToken = localStorage.getItem('adminToken');
      
      // Clean up the comma-separated question IDs into a neat array
      const cleanedQuestionIds = formData.questionIds
        .split(',')
        .map(id => id.trim())
        .filter(id => id !== '');

      // Prepare payload to match backend schema
      const payload = {
        title: formData.title,
        courseCode: formData.courseCode,
        date: new Date(formData.date).toISOString(),
        startTime: formData.startTime,
        endTime: formData.endTime,
        duration: Number(formData.duration),
        questionIds: cleanedQuestionIds
      };

      // CHANGE 2: Use raw axios to completely bypass the student token interceptor
      await axios.post('http://localhost:5000/api/exams', payload, {
        headers: { 
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });

      toast({
        title: 'Exam Scheduled Successfully!',
        description: `${formData.courseCode} has been added to the database.`,
        status: 'success',
        duration: 4000,
        isClosable: true,
        position: 'top-right'
      });

      // Clear the form for the next entry
      setFormData({
        title: '', courseCode: '', date: '', startTime: '', endTime: '', duration: 60, questionIds: ''
      });

    } catch (error) {
      toast({
        title: 'Failed to schedule exam',
        description: error.response?.data?.message || 'Please check your inputs and try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit} w="full">
      <Heading size="md" mb={6} color="gray.700">Schedule New Examination</Heading>
      
      <VStack spacing={5}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} w="full">
          <FormControl isRequired>
            <FormLabel>Course Code</FormLabel>
            <Input name="courseCode" value={formData.courseCode} onChange={handleChange} placeholder="e.g., CSC 401" bg="white" />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Exam Title</FormLabel>
            <Input name="title" value={formData.title} onChange={handleChange} placeholder="e.g., Cloud Infrastructure Midterm" bg="white" />
          </FormControl>
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} w="full">
          <FormControl isRequired>
            <FormLabel>Date</FormLabel>
            <Input name="date" type="date" value={formData.date} onChange={handleChange} bg="white" />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Start Time</FormLabel>
            <Input name="startTime" type="time" value={formData.startTime} onChange={handleChange} bg="white" />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>End Time</FormLabel>
            <Input name="endTime" type="time" value={formData.endTime} onChange={handleChange} bg="white" />
          </FormControl>
        </SimpleGrid>

        <FormControl isRequired>
          <FormLabel>Duration (Minutes)</FormLabel>
          <Input name="duration" type="number" min="1" value={formData.duration} onChange={handleChange} bg="white" />
        </FormControl>

        {/* Removed the isRequired tag here so you can test it safely */}
        <FormControl>
          <FormLabel>Attach Questions (IDs)</FormLabel>
          <Textarea 
            name="questionIds" 
            value={formData.questionIds} 
            onChange={handleChange} 
            placeholder="Paste MongoDB Object IDs separated by commas..." 
            bg="white"
            rows={3}
          />
          <FormHelperText>
            Paste the IDs of the questions you want to include. We will build a UI picker for this in the next sprint.
          </FormHelperText>
        </FormControl>

        <Button 
          type="submit" 
          colorScheme="blue" 
          size="lg" 
          w="full" 
          mt={4}
          isLoading={isLoading}
          loadingText="Scheduling..."
        >
          Publish Exam
        </Button>
      </VStack>
    </Box>
  );
};

export default ExamCreator;