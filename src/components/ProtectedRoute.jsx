import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem('authToken');  // Verifica se o token JWT está no localStorage

  return token ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
