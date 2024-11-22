import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProfileHorse.css';

const ProfileHorse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [horse, setHorse] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchHorse = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/horses/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Erro ao carregar perfil do cavalo');
        }

        const data = await response.json();
        setHorse(data);
        setSelectedImage(0);
      } catch (error) {
        setError('Erro ao carregar perfil do cavalo');
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchHorse();
    } else {
      setError('Token não encontrado');
      setIsLoading(false);
    }
  }, [id, token]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/horses/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar cavalo');
      }

      navigate('/myhorses');
    } catch (error) {
      setError('Erro ao deletar cavalo');
    }
  };

  if (isLoading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="profile-horse-container">
      {horse && (
        <>
          <h1>{horse.name}</h1>
          <p>Raça: {horse.breed}</p>
          <p>Idade: {horse.age}</p>
          <p>Gênero: {horse.gender}</p>
          <button onClick={handleDelete}>Deletar Cavalo</button>
        </>
      )}
    </div>
  );
};

export default ProfileHorse;
