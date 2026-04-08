// src/components/ExamTimer.jsx
import { useState, useEffect } from 'react';
import { Box } from '@chakra-ui/react';

const ExamTimer = ({ duration, onExpire, sessionId }) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60);

  useEffect(() => {
    // We use the sessionId to create a unique storage key for this specific attempt
    const storageKey = `exam_end_time_${sessionId}`;
    let endTime = sessionStorage.getItem(storageKey);

    // If there is no end time stored, this is a fresh session. Calculate and store it.
    if (!endTime) {
      endTime = Date.now() + duration * 60 * 1000;
      sessionStorage.setItem(storageKey, endTime);
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
      
      setTimeLeft(remaining);

      // When time hits zero, clear the timer and trigger the auto-submit callback
      if (remaining <= 0) {
        clearInterval(interval);
        sessionStorage.removeItem(storageKey);
        onExpire();
      }
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [duration, onExpire, sessionId]);

  // Format the seconds into HH:MM:SS or MM:SS
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Change color to red if less than 5 minutes (300 seconds) remain
  const isLowTime = timeLeft <= 300;

  return (
    <Box 
      p={3} 
      bg={isLowTime ? 'red.50' : 'blue.50'} 
      color={isLowTime ? 'red.600' : 'blue.600'} 
      borderRadius="md" 
      fontWeight="bold"
      borderWidth="1px"
      borderColor={isLowTime ? 'red.200' : 'blue.200'}
    >
      Time Remaining: {formatTime(timeLeft)}
    </Box>
  );
};

export default ExamTimer;