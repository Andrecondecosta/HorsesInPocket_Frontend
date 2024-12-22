import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem('authToken');  // Verifique a chave 'authToken'

  return token ? element : <Navigate to="/login"/>;
};

export default ProtectedRoute;
