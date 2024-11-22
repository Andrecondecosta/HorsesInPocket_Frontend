import { useState } from 'react';

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  const register = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://horsesinpocket-backend-2.onrender.com/api/v1/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: userData }),  // Enviando os dados corretamente
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errors || 'Falha ao registrar usuário');
      }

      setToken(data.token);  // Supondo que o backend retorne um token JWT
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { register, token, loading, error };
};
