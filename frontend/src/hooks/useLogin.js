import { useState } from 'react';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  const login = async (email, password, sharedToken) => {
    setLoading(true);
    setError(null);

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), 30000)
    );

    try {
      const fetchPromise = fetch(`${process.env.REACT_APP_API_SERVER_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, shared_token: sharedToken }),
      });

      const response = await Promise.race([fetchPromise, timeoutPromise]);
      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        localStorage.setItem('authToken', data.token);
      } else {
        setError(data.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      const errorMessage = err.message === 'Request timeout'
        ? 'Connection timeout. Please check your internet connection.'
        : 'Network error. Please check your connection and try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('authToken');
  };

  return { login, logout, token, loading, error };
};
