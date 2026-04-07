// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import { Box, Heading } from '@chakra-ui/react';

function App() {
  return (
    <Box p={4}>
      <Routes>
        {/* We will replace this with our actual routes in Issue 2 & 3 */}
        <Route path="/" element={<Heading>CBT System Initialized</Heading>} />
      </Routes>
    </Box>
  );
}

export default App;