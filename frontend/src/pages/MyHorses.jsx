import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './MyHorses.css';
import Layout from '../components/Layout';
import { useApiCall } from '../hooks/useApiCall';

const MyHorses = () => {
  const [horses, setHorses] = useState([]);
  const [userStatus, setUserStatus] = useState(null);
  const [showLimitPopup, setShowLimitPopup] = useState(false);
  const { apiCall, loading, error } = useApiCall();

  const token = localStorage.getItem('authToken');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHorses = async () => {
      await apiCall(
        async () => {
          const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/horses`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!response.ok) throw new Error("Failed to load horses");

          const data = await response.json();
          setHorses(data);
          return data;
        },
        {
          onError: (err) => console.error("Error fetching horses:", err)
        }
      );
    };

    const fetchUserStatus = async () => {
      await apiCall(
        async () => {
          const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/user_status`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) throw new Error("Failed to load user status");

          const data = await response.json();
          setUserStatus(data);
          return data;
        },
        {
          onError: (err) => console.error("Error fetching user status:", err)
        }
      );
    };

    if (token) {
      fetchHorses();
      fetchUserStatus();
    }
  }, [token, apiCall]);

  const handleCreateClick = (e) => {
    e.preventDefault();

    if (userStatus && userStatus.used_horses >= userStatus.max_horses) {
      setShowLimitPopup(true);
    } else {
      navigate("/newhorse");
    }
  };

  return (
    <Layout>
      <div className="my-horses-container">
        <h1 className="page-title">My Horses</h1>

        {error && (
          <div style={{
            padding: '1rem',
            marginBottom: '1rem',
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            borderRadius: '0.5rem',
            color: '#c33'
          }}>
            {error}
          </div>
        )}

        <div className="profile-breadcrumb-container">
          <div className="breadcrumbs">
            <Link to="/dashboard">Dashboard</Link> / <span>My Horses</span>
          </div>
          <button className="create-button" onClick={handleCreateClick} disabled={loading}>
            <span>+</span> Create
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            Loading horses...
          </div>
        ) : (
          <div className="horses-grid">
            {horses
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .map((horse) => (
                <div className="horse-card" key={horse.id}>
                  <div className="horse-image-container">
                    {horse.images && horse.images.length > 0 ? (
                      <img src={horse.images[0]} alt={horse.name} className="myhorse-image" />
                    ) : (
                      <div className="placeholder-image">No Image</div>
                    )}
                  </div>
                  <div className="horse-info">
                    <h3 className="horse-name">{horse.name}</h3>
                    <p className="horse-description">{horse.color || 'Brief Description'}</p>
                    <Link to={`/horses/${horse.id}`} className="details-button">
                      Learn More
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Popup de Limite de Cavalos */}
        {showLimitPopup && (
          <div className="popup-overlay">
            <div className="popup-content">
              <h3>🚨 Horse Limit Reached!</h3>
              <p>You have reached the horse limit of your plan. To continue, please upgrade.</p>

              <div className="popup-buttons">
                <button className="popup-btn secondary" onClick={() => setShowLimitPopup(false)}>
                  OK
                </button>
                <button className="popup-btn primary" onClick={() => navigate('/profile')}>
                  View My Plan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

    </Layout>
  );
};

export default MyHorses;
