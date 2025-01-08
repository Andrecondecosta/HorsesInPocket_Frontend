import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import './MyHorses.css';

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
    <Layout>
      <div className="my-horses-container">
        <h1 className="page-title">Cavalos Recebidos</h1>
        <div className="profile-breadcrumb-container">
          <div className="breadcrumbs">
            <a href="/dashboard">Dashboard</a> / <span>Cavalos Recebidos</span>
          </div>
        </div>
        <div className="horses-grid">
          {horses.map((horse) => (
            <div key={horse.id} className="horse-card">
              <div className="horse-image-container">
                {horse.images && horse.images.length > 0 ? (
                  <img src={horse.images[0]} alt={horse.name} className="myhorse-image" />
                ) : (
                  <div className="placeholder-image">Sem Imagem</div>
                )}
              </div>
              <div className="horse-info">
                <h3 className="horse-name">{horse.name}</h3>
                <p className="horse-sender"><strong> Enviado por: </strong> <br /> {horse.sender_name || "Desconhecido"}</p>
                <button
                  onClick={() => navigate(`/horses/${horse.id}?readonly=true`)}
                  className="details-button"
                >
                  Ver Detalhes
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ReceivedHorses;
