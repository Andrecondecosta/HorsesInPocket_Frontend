import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ReceivedHorses.css';

const ReceivedHorses = () => {
  const [horses, setHorses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('authToken');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReceivedHorses = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/received`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch received horses');
        }

        const data = await response.json();
        setHorses(data || []); // Garante que `horses` será um array válido
      } catch (error) {
        setError('Erro ao carregar cavalos recebidos');
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchReceivedHorses();
    } else {
      setError('Token não encontrado');
      setIsLoading(false);
    }
  }, [token]);

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="received-horses-container">
      <h1>Cavalos Recebidos</h1>
      <div className="horses-grid">
        {horses.map((horse) => (
          <div key={horse.id} className="horse-card">
            src={horse.images?.[0] || "/placeholder.jpg"}
            <div className="horse-info">
              <h2 className="horse-name">{horse.name}</h2>
              <p className="horse-sender">Enviado por: {horse.sender_name}</p>
              <button onClick={() => navigate(`/horses/${horse.id}?readonly=true`)}>Ver Detalhes</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReceivedHorses;
