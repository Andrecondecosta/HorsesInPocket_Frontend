import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('authToken'); // Use a mesma chave usada para armazenar o token

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
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchProfile();
    } else {
      setError('Token não encontrado');
      setIsLoading(false);
    }
  }, [token]);

  if (isLoading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="profile-page-container">
      <h1>Perfil do Usuário</h1>
      <p>Nome: {user.name}</p>
      <p>Email: {user.email}</p>
      <Link to="/editprofile">
        <button>Editar Perfil</button>
      </Link>
    </div>
  );
};

export default ProfilePage;
