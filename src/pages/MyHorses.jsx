import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MyHorses.css'; // Importa o CSS externo

const MyHorses = () => {
  const [horses, setHorses] = useState([]);

  useEffect(() => {
    const fetchHorses = async () => {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3000/api/v1/horses', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setHorses(data);
    };

    fetchHorses();
  }, []);

  return (
    <div className="horses-container">
      <div className="header">
        <h1 className="title">Meus Cavalos</h1>
        <Link to="/newhorse">
          <button className="create-button">+</button>
        </Link>
      </div>
      <div className="horses-grid">
        {horses.map((horse) => (
          <Link to={`/horses/${horse.id}`} key={horse.id} className="horse-link">
            <div className="horse-card">
              {horse.image_url && (
                <img src={horse.image_url} alt={horse.name} className="horse-image" />
              )}
              <div className="horse-info">
                <h3 className="horse-name">{horse.name}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MyHorses;
