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
        const response = await fetch('http://localhost:3000/api/v1/profile', {
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

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Perfil do Usuário</h1>
      <p><strong>Nome:</strong> {user.first_name} {user.last_name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Data de Nascimento:</strong> {user.birthdate}</p>
      <p><strong>Telefone:</strong> {user.phone_number}</p>
      <p><strong>Endereço:</strong> {user.address}</p>
      <p><strong>Gênero:</strong> {user.gender}</p>

      <Link to="/update-profile">
        <button>Atualizar Perfil</button>
      </Link>
    </div>
  );
};

export default ProfilePage;
