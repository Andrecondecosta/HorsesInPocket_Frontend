import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UpdateProfilePage = () => {
  const [user, setUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    birthdate: '',
    phone_number: '',
    address: '',
    gender: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
      const response = await fetch('http://localhost:3000/api/v1/update', { // Corrige a URL aqui
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Inclui o token aqui
        },
        body: JSON.stringify({ user }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      navigate('/profile'); // Redireciona para a página de perfil após a atualização
    } catch (error) {
      setError('Erro ao atualizar perfil do usuário');
    } finally {
      setLoading(false);
    }
  };

  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Atualizar Perfil</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="first_name"
          placeholder="Primeiro Nome"
          value={user.first_name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="last_name"
          placeholder="Último Nome"
          value={user.last_name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={user.email}
          onChange={handleChange}
        />
        <input
          type="date"
          name="birthdate"
          placeholder="Data de Nascimento"
          value={user.birthdate}
          onChange={handleChange}
        />
        <input
          type="text"
          name="phone_number"
          placeholder="Telefone"
          value={user.phone_number}
          onChange={handleChange}
        />
        <input
          type="text"
          name="address"
          placeholder="Endereço"
          value={user.address}
          onChange={handleChange}
        />
        <select
          name="gender"
          value={user.gender}
          onChange={handleChange}
        >
          <option value="">Selecione o Gênero</option>
          <option value="male">Masculino</option>
          <option value="female">Feminino</option>
          <option value="other">Outro</option>
        </select>
        <button type="submit" disabled={loading}>Atualizar</button>
      </form>
    </div>
  );
};

export default UpdateProfilePage;
