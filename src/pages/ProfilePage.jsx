import React, { useState, useEffect } from 'react';
import { FaEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import LoadingPopup from '../components/LoadingPopup';
import './ProfilePage.css';

const ProfilePage = () => {
  const [user, setUser] = useState({});
  const [plan, setPlan] = useState(''); // Estado para armazenar o plano
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error loading profile');
        }

        const data = await response.json();
        setUser(data);

        // Obter plano do backend
        const planResponse = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/get_user_plan`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!planResponse.ok) {
          throw new Error('Error loading plan');
        }

        const planData = await planResponse.json();
        setPlan(planData.plan); // Atualiza o estado com o plano do utilizador

      } catch (error) {
        setError('Error loading user profile');
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchProfile();
    } else {
      setError('Token not found');
      setIsLoading(false);
    }
  }, [token]);

  const avatarUrl =
    user.gender === 'male'
      ? 'https://res.cloudinary.com/dcvtrregd/image/upload/v1736802678/user_1_vl6pae.png'
      : 'https://res.cloudinary.com/dcvtrregd/image/upload/v1736802680/user_yp8nup.png';

      const handleChangePlan = async () => {
        const newPlan = plan === 'premium' ? 'free' : 'premium'; // Alterna entre os planos

        try {
          const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/change_plan`, {
            method: 'POST',
            body: JSON.stringify({ plan: newPlan }), // Certifique-se de que apenas dados simples estão sendo passados
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('Erro ao mudar plano');
          }

          const data = await response.json();
          setPlan(data.plan); // Atualiza o plano após a mudança
          alert('Plano alterado com sucesso!');
        } catch (error) {
          console.error('Erro ao mudar plano:', error);
          alert('Erro ao tentar mudar o plano.');
        }
      };

      <button onClick={() => handleChangePlan()}>
        {plan === 'premium' ? 'Mudar para plano gratuito' : 'Mudar para plano Premium'}
      </button>



  if (isLoading) return <LoadingPopup message="Loading ..." />;
  if (error) return <p>{error}</p>;

  return (
    <Layout>
      <div className="profile-page-container">
        <h1 className="page-title">Settings</h1>
        <div className="profile-breadcrumb-container">
          <div className="breadcrumbs">
            <a href="/dashboard">Dashboard</a> / <span>Settings</span>
          </div>
          <Link to="/update-profile" className="profile-edit-button-link">
            <button className="profile-edit-button">
              <FaEdit /> Edit
            </button>
          </Link>
        </div>
        <div className="profile-details-container">
          {/* Profile image */}
          <div className="profile-image">
            <img
              src={user.avatar || avatarUrl} // Generic avatar
              alt="Profile Picture"
            />
          </div>

          {/* Profile information */}
          <div className="profile-details">
            <p>
              <strong>Name:</strong> {user.first_name} {user.last_name}
            </p>
            <p>
              <strong>Date of Birth:</strong> {user.birthdate || 'dd/mm/yyyy'}
            </p>
            <p>
              <strong>Gender:</strong> {user.gender || 'Not specified'}
            </p>
            <p>
              <strong>Phone:</strong> {user.phone_number || 'Not specified'}
            </p>
            <p>
              <strong>Address:</strong> {user.address || 'Not specified'}
            </p>
            <p>
              <strong>Plan:</strong> {plan || 'Loading...'}
            </p>
            <button onClick={handleChangePlan}>
              {plan === 'premium' ? 'Mudar para plano gratuito' : 'Mudar para plano Premium'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
