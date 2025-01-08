import React, { useState, useEffect } from 'react';
import { FaSave } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import './ProfilePage.css';
import './UpdateProfilePage.css';

const UpdateProfilePage = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    birthdate: '',
    gender: '',
    phone_number: '',
    address: '',
  });
  const [avatar, setAvatar] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const token = localStorage.getItem('authToken');
  const navigate = useNavigate();

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
        setFormData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          birthdate: data.birthdate || '',
          gender: data.gender || '',
          phone_number: data.phone_number || '',
          address: data.address || '',
        });
        setAvatar(data.avatar || 'https://via.placeholder.com/150');
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ user: formData }), // Certifique-se de usar "user"
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar perfil');
      }

      setSuccess('Perfil atualizado com sucesso!');
      setTimeout(() => navigate('/profile'), 2000);
    } catch (error) {
      setError('Erro ao atualizar perfil');
    }
  };

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Layout >
      <div className="update-profile-page-container">
        <h1 className="page-title">Editar Perfil</h1>
        <div className="profile-breadcrumb-container">
          <div className="breadcrumbs">
            <a href="/dashboard">Dashboard</a> / <a href="/profile">Definições</a> / <span>Editar Perfil</span>
          </div>
          {/* Botão Salvar conectado ao formulário */}
          <div className="profile-edit-actions">
            <button
              type="submit"
              className="profile-save-button"
              form="update-profile-form" // Conecta o botão ao formulário
            >
              <FaSave /> Salvar
            </button>
          </div>
        </div>
        <div className="update-profile-details-container">
          {/* Imagem de perfil */}
          <div className="profile-image">
            <img src={avatar} alt="Foto de Perfil" />
          </div>

          {/* Formulário de edição */}
          <form
            id="update-profile-form" // Identificador do formulário
            onSubmit={handleSubmit}
            className="inline-edit-profile"
          >
            <div className="profile-details">
              <p>
                <strong>Nome:</strong>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="inline-input"
                />
              </p>
              <p>
                <strong>Apelido:</strong>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="inline-input"
                />
              </p>
              <p>
                <strong>Data de Nascimento:</strong>
                <input
                  type="date"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleInputChange}
                  className="inline-input"
                />
              </p>
              <p>
                <strong>Gênero:</strong>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="inline-input"
                >
                  <option value="">Selecione</option>
                  <option value="male">Masculino</option>
                  <option value="female">Feminino</option>
                  <option value="other">Outro</option>
                </select>
              </p>
              <p>
                <strong>Telefone:</strong>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className="inline-input"
                />
              </p>
              <p>
                <strong>Endereço:</strong>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="inline-input"
                />
              </p>
            </div>
          </form>
        </div>
        {success && <p className="success-message">{success}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>
    </Layout>
  );
};

export default UpdateProfilePage;
