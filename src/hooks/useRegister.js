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
          user: userData,  // Enviando os dados do usuário
          shared_token: sharedToken,  // Enviando o token compartilhado
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.token) {
        throw new Error(data.errors?.join(', ') || 'Falha ao registrar usuário');
      }

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("hasSeenPopup", "newUser"); // 🔥 Marca como novo usuário

      setToken(data.token);
      return data.token; // Retorna o token explicitamente
    } catch (err) {
      setError(err.message);
      return null; // Retorna nulo em caso de erro
    } finally {
      setLoading(false);
    }
  };

  return { register, token, loading, error };
};
