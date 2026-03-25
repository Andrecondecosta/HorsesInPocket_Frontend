import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem('authToken');

  if (!token) return <Navigate to="/login" />;

  try {
    const decoded = jwtDecode(token);
    const isExpired = decoded.exp && decoded.exp * 1000 < Date.now();
    if (isExpired) {
      localStorage.removeItem('authToken');
      return <Navigate to="/login" />;
    }
  } catch {
    localStorage.removeItem('authToken');
    return <Navigate to="/login" />;
  }

  return element;
};

export default ProtectedRoute;
