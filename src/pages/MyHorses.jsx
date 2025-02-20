import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MyHorses.css';
import Layout from '../components/Layout';
import SubscriptionPlans from '../components/SubscriptionPlans';
import SavePaymentMethod from '../components/SavePaymentMethod';

const MyHorses = () => {
  const [horses, setHorses] = useState([]);
  const [showPlanPopup, setShowPlanPopup] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    const fetchHorses = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/horses`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      const data = await response.json();
      setHorses(data);
    };

    fetchHorses();
  }, []);

  // ✅ Função que seleciona o plano e abre o pagamento
  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setShowPlanPopup(false); // Fecha o popup de planos
    setShowPaymentPopup(true); // Abre o popup de pagamento
  };

  // ✅ Função que fecha o pagamento e atualiza o estado
  const handlePaymentSuccess = (newPlanName) => {
    setShowPaymentPopup(false);
    alert(`Plano ${newPlanName} ativado com sucesso!`);
    window.location.reload(); // 🔥 Atualiza para refletir mudanças
  };

  return (
    <Layout>
      <div className="my-horses-container">
        <h1 className="page-title">My Horses</h1>

        <div className="profile-breadcrumb-container">
          <div className="breadcrumbs">
            <a href="/dashboard">Dashboard</a> / <span>My Horses</span>
          </div>
          <button className="create-button" onClick={() => setShowPlanPopup(true)}>
            <span>+</span> Create
          </button>
        </div>

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
      </div>

      {/* 🔥 Popup de Seleção de Plano */}
      {showPlanPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <SubscriptionPlans onSelectPlan={handleSelectPlan} onClose={() => setShowPlanPopup(false)} />
          </div>
        </div>
      )}

      {/* 🔥 Popup de Pagamento (só aparece se um plano for selecionado) */}
      {showPaymentPopup && selectedPlan && (
        <div className="popup-overlay">
          <div className="popup-content">
            <SavePaymentMethod selectedPlan={selectedPlan} onPaymentSuccess={() => handlePaymentSuccess(selectedPlan.name)} />
          </div>
        </div>
      )}
    </Layout>
  );
};

export default MyHorses;
