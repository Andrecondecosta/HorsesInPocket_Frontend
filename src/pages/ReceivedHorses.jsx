import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation} from 'react-router-dom';
import Layout from '../components/Layout';
import LoadingPopup from '../components/LoadingPopup';


import './MyHorses.css';

const ReceivedHorses = () => {
  const [horses, setHorses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('authToken');
  const navigate = useNavigate();
  const location = useLocation(); // ⬅️ Captura a mensagem do `state`
  const message = location.state?.message || localStorage.getItem('receivedMessage');

  useEffect(() => {
    if (message) {
      localStorage.setItem('receivedMessage', message);
    }
  }, [message]);

  useEffect(() => {
    const fetchReceivedHorses = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/received`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch received horses');
        }

        const data = await response.json();
        setHorses(data || []); // Ensures `horses` will be a valid array
      } catch (error) {
        setError('Error loading received horses');
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchReceivedHorses();
    } else {
      setError('Token not found');
      setIsLoading(false);
    }
  }, [token]);

  if (isLoading) return <LoadingPopup message="Loading horse details, please wait..." />;
  if (error) return <p>{error}</p>;

  return (
    <Layout>
      <div className="my-horses-container">
        <h1 className="page-title">Received Horses</h1>
        <div className="profile-breadcrumb-container">
          <div className="breadcrumbs">
            <a href="/dashboard">Dashboard</a> / <span>Received Horses</span>
          </div>
        </div>
        <div className="horses-grid">
          {horses.map((horse) => (
            <div key={horse.id} className="horse-card">
              <div className="horse-image-container">
                {horse.images && horse.images.length > 0 ? (
                  <img src={horse.images[0]} alt={horse.name} className="myhorse-image" />
                ) : (
                  <div className="placeholder-image">No Image</div>
                )}
              </div>
              <div className="horse-info">
                <h3 className="horse-name">{horse.name}</h3>
                <p className="horse-sender">
                  <strong> Sent by: </strong>
                  <br />
                  {horse.sender_name || 'Unknown'}
                </p>
                <button
                  onClick={() => navigate(`/horses/${horse.id}?readonly=true`)}
                  className="details-button"
                >
                  View Details
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
