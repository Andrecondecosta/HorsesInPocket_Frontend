import { useState } from 'react';

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  const register = async (email, password, passwordConfirmation) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/api/v1/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: { email, password, password_confirmation: passwordConfirmation },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        localStorage.setItem('token', data.token);  // Salva o token no localStorage
      } else {
        setError(data.errors ? data.errors.join(', ') : 'Erro ao registrar');
      }
    } catch (err) {
      setError('Erro de rede');
    } finally {
      setLoading(false);
    }
  };

  return { register, token, loading, error };
};
