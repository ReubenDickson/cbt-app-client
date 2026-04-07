// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();

  if (!token) {
    // Not logged in? Kick them to the login page
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;