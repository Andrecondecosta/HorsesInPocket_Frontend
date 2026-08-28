import { useState } from 'react';

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  const register = async (userData, sharedToken) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: userData,
          shared_token: sharedToken,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.token) {
        throw new Error(data.errors?.join(', ') || 'Failed to register user');
      }

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("hasSeenPopup", "newUser");

      setToken(data.token);
      return data.token;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { register, token, loading, error };
};
