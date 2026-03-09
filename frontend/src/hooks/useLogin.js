import { useState } from 'react';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  const login = async (email, password, sharedToken) => {  // Adicione o parâmetro sharedToken
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, shared_token: sharedToken }),  // Envia o sharedToken no corpo
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        localStorage.setItem('authToken', data.token);  // Use a chave 'authToken'
      } else {
        setError(data.error || 'Erro ao fazer login');
      }
    } catch (err) {
      setError('Erro de rede');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('authToken');  // Use a chave 'authToken'
  };

  return { login, logout, token, loading, error };
};
