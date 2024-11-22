import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UpdateProfilePage = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    // Adicione outros campos conforme necessário
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('authToken'); // Use a mesma chave usada para armazenar o token
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Inclui o token aqui
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        setError('Erro ao carregar perfil do usuário');
      }
    };

    if (token) {
      fetchProfile();
    } else {
      setError('Token não encontrado');
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Inclui o token aqui
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors || 'Failed to update profile');
      }

      navigate('/profile');
    } catch (error) {
      setError('Erro ao atualizar perfil do usuário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-profile-page-container">
      <h1>Atualizar Perfil</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Nome:
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            required
          />
        </label>
        {/* Adicione outros campos conforme necessário */}
        <button type="submit" disabled={loading}>
          {loading ? 'Atualizando...' : 'Atualizar Perfil'}
        </button>
      </form>
    </div>
  );
};

export default UpdateProfilePage;
