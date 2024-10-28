import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditHorse.css';

const EditHorse = () => {
  const { id } = useParams();
  const [horse, setHorse] = useState({
    name: '',
    birthDate: '',
    description: '',
    image: null,
  });
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchHorse = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/v1/horses/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch horse');
        }

        const data = await response.json();
        setHorse(data);
      } catch (error) {
        console.error('Erro ao carregar perfil do cavalo:', error);
      }
    };

    if (token) {
      fetchHorse();
    } else {
      console.error('Token não encontrado');
    }
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHorse((prevHorse) => ({
      ...prevHorse,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('horse[name]', horse.name);
    formData.append('horse[birthDate]', horse.birthDate);
    formData.append('horse[description]', horse.description);
    if (image) {
      formData.append('horse[image]', image);
    }

    const response = await fetch(`http://localhost:3000/api/v1/horses/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.ok) {
      navigate(`/horses/${id}`);
    } else {
      console.error('Erro ao atualizar cavalo:', response.statusText);
    }
  };

  return (
    <div className="edit-horse-container">
      <h1 className="edit-horse-title">Editar Cavalo</h1>
      <form className="edit-horse-form" onSubmit={handleSubmit}>
        <label className="edit-input-label">Nome</label>
        <input
          type="text"
          name="name"
          placeholder="Nome"
          value={horse.name}
          onChange={handleChange}
          required
        />

        <label className="edit-input-label">Data de Nascimento</label>
        <input
          type="date"
          name="birthDate"
          placeholder="Data de Nascimento"
          value={horse.birthDate}
          onChange={handleChange}
          required
        />

        <label className="edit-input-label">Descrição</label>
        <textarea
          name="description"
          placeholder="Descrição"
          value={horse.description}
          onChange={handleChange}
          required
        />

        <label className="edit-input-label">Imagem</label>
        <input type="file" onChange={handleImageChange} />

        <button type="submit" className="edit-horse-submit-button">Atualizar Cavalo</button>
      </form>
    </div>
  );
};

export default EditHorse;
