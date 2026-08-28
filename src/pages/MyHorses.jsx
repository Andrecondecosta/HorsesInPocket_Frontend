import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './MyHorses.css';
import Layout from '../components/Layout';
import LoadingPopup from '../components/LoadingPopup';
import { isNativeiOS } from '../utils/isNative';

const MyHorses = () => {
  const [horses, setHorses] = useState([]);
  const [userStatus, setUserStatus] = useState(null);
  const [showLimitPopup, setShowLimitPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const token = localStorage.getItem('authToken');
  const navigate = useNavigate();
  const native = isNativeiOS();

  useEffect(() => {
    const fetchHorses = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/horses`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Error loading horses");

        const data = await response.json();
        setHorses(data);
      } catch (error) {
        setFetchError("Unable to load horses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const fetchUserStatus = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/user_status`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Error loading user status");

        const data = await response.json();
        setUserStatus(data);
      } catch (error) {
        console.error("Error fetching user status:", error);
      }
    };

    if (token) {
      fetchHorses();
      fetchUserStatus();
    }
  }, [token]);

  const handleCreateClick = (e) => {
    e.preventDefault();

    if (userStatus && userStatus.used_horses >= userStatus.max_horses) {
      setShowLimitPopup(true);
    } else {
      navigate("/newhorse");
    }
  };

  if (loading) return <LoadingPopup message="Loading..." />;

  return (
    <Layout>
      <div className="my-horses-container" data-testid="my-horses-container">
        <h1 className="page-title">My Horses</h1>

        <div className="profile-breadcrumb-container">
          <div className="breadcrumbs">
            <Link to="/dashboard">Dashboard</Link> / <span>My Horses</span>
          </div>
          <button className="create-button" data-testid="create-horse-btn" onClick={handleCreateClick}>
            <span>+</span> Create
          </button>
        </div>

        <div className="horses-grid">
          {fetchError ? (
            <p className="horses-error">{fetchError}</p>
          ) : horses.length === 0 ? (
            <p className="horses-empty">No horses yet. Create your first horse!</p>
          ) : (
            horses
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .map((horse) => (
                <div className="horse-card" key={horse.id} data-testid={`horse-card-${horse.id}`}>
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
              ))
          )}
        </div>

        {/* Horse limit popup — on native iOS, hide upgrade/payment references */}
        {showLimitPopup && (
          <div className="popup-overlay" data-testid="horse-limit-popup">
            <div className="popup-content">
              <h3>Horse Limit Reached!</h3>
              {native ? (
                <>
                  <p>You have reached the horse limit of your current plan. Please manage your subscription through your device settings.</p>
                  <div className="popup-buttons">
                    <button className="popup-btn secondary" data-testid="limit-popup-ok-btn" onClick={() => setShowLimitPopup(false)}>
                      OK
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p>You have reached the horse limit of your plan. To continue, please upgrade.</p>
                  <div className="popup-buttons">
                    <button className="popup-btn secondary" data-testid="limit-popup-ok-btn" onClick={() => setShowLimitPopup(false)}>
                      OK
                    </button>
                    <button className="popup-btn primary" data-testid="limit-popup-upgrade-btn" onClick={() => navigate('/profile')}>
                      View My Plan
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

    </Layout>
  );
};

export default MyHorses;
