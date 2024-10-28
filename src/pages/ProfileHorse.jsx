import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';

function ProfileHorse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [horse, setHorse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
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
      const response = await fetch(`http://localhost:3000/api/v1/horses/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete horse');
      }

      navigate('/');
    } catch (error) {
      setError('Erro ao excluir cavalo');
    }
  };

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Perfil do Cavalo</h1>
      {horse && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>{horse.name}</h2>
            <div>
              <FaEdit style={{ cursor: 'pointer', marginRight: '10px' }} onClick={() => navigate(`/horses/${id}/edit`)} />
              <FaTrash style={{ cursor: 'pointer' }} onClick={handleDelete} />
            </div>
          </div>
          {horse.image_url && (
            <img src={horse.image_url} alt={horse.name} style={{ width: '300px', height: '300px', objectFit: 'cover' }} />
          )}
          <p><strong>Nome:</strong> {horse.name}</p>
          <p><strong>Idade:</strong> {horse.age}</p>
          <p><strong>Descrição:</strong> {horse.description}</p>
        </div>
      )}
    </div>
  );
}

export default ProfileHorse;
