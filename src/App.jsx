// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Heading } from '@chakra-ui/react';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; // Placeholder for future dashboard page

function App() {
  return (
    <AuthProvider>
      <Box p={4} minH="100vh" bg="gray.50">
        <Routes>
          {/* Public Routes (Placeholders for Issue 3 & 4) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
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