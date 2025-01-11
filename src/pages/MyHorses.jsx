import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MyHorses.css';
import Layout from '../components/Layout';

const MyHorses = () => {
  const [horses, setHorses] = useState([]);

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
              <Link to={`/horses/${horse.id}`} className="details-button">
                Saber Mais
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  </Layout>
  );
};

export default MyHorses;
