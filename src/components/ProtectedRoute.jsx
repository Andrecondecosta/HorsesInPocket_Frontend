import jwtDecode from 'jwt-decode';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem('authToken');

  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    const decoded = jwtDecode(token);
    const isExpired = decoded.exp * 1000 < Date.now();

    if (isExpired) {
      localStorage.removeItem('authToken');  // Remove token expirado
      return <Navigate to="/login" />;
    }

    return element;  // Token válido
  } catch (err) {
    console.error('Invalid token', err);
    localStorage.removeItem('authToken');
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;
