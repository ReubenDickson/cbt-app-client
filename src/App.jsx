// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Heading } from '@chakra-ui/react';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './pages/Register';

function App() {
  return (
    <AuthProvider>
      <Box p={4} minH="100vh" bg="gray.50">
        <Routes>
          {/* Public Routes (Placeholders for Issue 3 & 4) */}
          <Route path="/login" element={<Heading>Login Page Coming Soon</Heading>} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Heading p={4}>Student Dashboard (Protected)</Heading>
              </ProtectedRoute>
            } 
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Box>
    </AuthProvider>
  );
}

export default App;