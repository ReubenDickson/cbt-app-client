// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Heading } from '@chakra-ui/react';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; // Placeholder for future dashboard page
import ExamEngine from './pages/ExamEngine';
import ResultView from './pages/ResultView';

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
          <Route
          path="/exam/:id" element={
            <ProtectedRoute>
              <ExamEngine />
            </ProtectedRoute>
          } />

          <Route
          path="/result" element={
          <ProtectedRoute>
            <ResultView />
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