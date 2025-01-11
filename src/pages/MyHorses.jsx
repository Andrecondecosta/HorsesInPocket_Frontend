import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './MyHorses.css';
import Layout from '../components/Layout';
import LoadingPopup from '../components/LoadingPopup'; // Import do componente de pop-up

const MyHorses = () => {
  const [horses, setHorses] = useState([]);
  const [loading, setLoading] = useState(false); // Estado para controlar o pop-up de carregamento
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHorses = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/horses`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      const data = await response.json();
      setHorses(data);
    };

    fetchHorses();
  }, []);

  const handleViewMore = (horseId) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate(`/horses/${horseId}`); // Navega para a página de detalhes do cavalo
    }, 2000); // Simula um tempo de espera antes de redirecionar
  };

  return (
    <Layout>
      <div className="my-horses-container">
        <h1 className="page-title">Meus Cavalos</h1>
        <div className="profile-breadcrumb-container">
          <div className="breadcrumbs">
            <a href="/dashboard">Dashboard</a> /{" "}
            <span>Meus Cavalos</span>
          </div>
          <Link to="/newhorse">
            <button className="create-button">
              <span>+</span> Criar
            </button>
          </Link>
        </div>
        <div className="horses-grid">
          {Array.isArray(horses) && horses.map((horse) => (
            <div className="horse-card" key={horse.id}>
              <div className="horse-image-container">
                {horse.images && horse.images.length > 0 ? (
                  <img src={horse.images[0]} alt={horse.name} className="myhorse-image" />
                ) : (
                  <div className="placeholder-image">Sem Imagem</div>
                )}
              </div>
              <div className="horse-info">
                <h3 className="horse-name">{horse.name}</h3>
                <p className="horse-description">{horse.color || 'Breve Descrição'}</p>
                <button
                  className="details-button"
                  onClick={() => handleViewMore(horse.id)}
                >
                  Saber Mais
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {loading && <LoadingPopup message="Carregando detalhes do cavalo, aguarde..." />}
    </Layout>
  );
};

export default MyHorses;
