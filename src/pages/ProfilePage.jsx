import React, { useState, useEffect } from 'react';
import { FaEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import LoadingPopup from '../components/LoadingPopup';
import './ProfilePage.css';

const ProfilePage = () => {
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Erro ao carregar perfil');
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

  if (isLoading) return <LoadingPopup message="Carregando ..." />;
  if (error) return <p>{error}</p>;

  return (
    <Layout>
      <div className="profile-page-container">
        <h1 className='page-title'>Definições</h1>
        <div className="profile-breadcrumb-container">
        <div className="breadcrumbs">
        <a href="/dashboard">Dashboard</a> /{" "}
        <span>Definições</span>
      </div>
          <Link to="/update-profile" className="profile-edit-button-link">
            <button className="profile-edit-button">
            <FaEdit /> Editar
            </button>
          </Link>
        </div>
        <div className="profile-details-container">
          {/* Imagem de perfil */}
          <div className="profile-image">
            <img
              src={user.avatar || 'https://via.placeholder.com/150'} // Avatar genérico
              alt="Foto de Perfil"
            />
          </div>

          {/* Informações do perfil */}
          <div className="profile-details">
            <p><strong>Nome:</strong> {user.first_name} {user.last_name}</p>
            <p><strong>Data de Nascimento:</strong> {user.birthdate || 'dd/mm/aaaa'}</p>
            <p><strong>Gênero:</strong> {user.gender || 'Não informado'}</p>
            <p><strong>Telefone:</strong> {user.phone_number || 'Não informado'}</p>
            <p><strong>Endereço:</strong> {user.address || 'Não informado'}</p>
          </div>

          {/* Botão de edição */}
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
