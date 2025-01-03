import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MyHorses.css';
import Layout from '../components/Layout';

const MyHorses = ({ setIsLoggedIn }) => {
  const [horses, setHorses] = useState([]);
  console.log('API URL:', process.env.REACT_APP_API_SERVER_URL);
  const token = localStorage.getItem('authToken'); // Or wherever you store it
  console.log("Token:", token);
  useEffect(() => {
    const fetchHorses = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/horses`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setHorses(data);
    };

    fetchHorses();
  }, []);

  return (
    <Layout setIsLoggedIn={setIsLoggedIn}>
    <div className="my-horses-container">
      <div className="header">
        <h1 className="title">Meus Cavalos</h1>
        <Link to="/newhorse">
          <button className="create-button">+</button>
        </Link>
      </div>
      <div className="horses-grid">
        {Array.isArray(horses) && horses.map((horse) => (
          <Link to={`/horses/${horse.id}`} key={horse.id} className="horse-link">
            <div className="horse-card">
              {horse.images && horse.images.length > 0 && (
                <img src={horse.images[0]} alt={horse.name} className="horse-image" />
              )}
              <div className="horse-info">
                <h3 className="horse-name">{horse.name}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
    </Layout>
  );
};

export default MyHorses;
