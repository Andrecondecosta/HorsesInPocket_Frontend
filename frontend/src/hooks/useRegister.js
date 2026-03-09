import { useState } from 'react';

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  const register = async (userData, sharedToken) => {
    setLoading(true);
    setError(null);

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), 30000)
    );

    try {
      const fetchPromise = fetch(`${process.env.REACT_APP_API_SERVER_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: userData,
          shared_token: sharedToken,
        }),
      });

      const response = await Promise.race([fetchPromise, timeoutPromise]);
      const data = await response.json();

      if (!response.ok || !data.token) {
        throw new Error(data.errors?.join(', ') || 'Failed to register user');
      }

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("hasSeenPopup", "newUser");

      setToken(data.token);
      return data.token;
    } catch (err) {
      const errorMessage = err.message === 'Request timeout'
        ? 'Connection timeout. Please check your internet connection.'
        : err.message || 'Network error. Please try again.';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { register, token, loading, error };
};
