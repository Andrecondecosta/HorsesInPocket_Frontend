import React, { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import LoadingPopup from "../components/LoadingPopup";
import SavePaymentMethod from "../components/SavePaymentMethod"; // 🆕 Importando o Componente de Pagamento
import "./ProfilePage.css";
import SubscriptionPlans from "../components/SubscriptionPlans";

const plans = [
  { name: "Basic", price: "€0,00", priceId: null },
  { name: "Plus", price: "€4,99", priceId: "price_1Qo67GDCGWh9lQnCP4woIdoo" },
  { name: "Premium", price: "€14,99", priceId: "price_1Qo67nDCGWh9lQnCV35pyiym" },
  { name: "Ultimate", price: "€34,99", priceId: "price_1Qo68DDCGWh9lQnCaWeRF1YO" },
];

const ProfilePage = () => {
  const [user, setUser] = useState({});
  const [plan, setPlan] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPlanPopup, setShowPlanPopup] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null); // 🔥 Estado para armazenar o plano selecionado
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Erro ao carregar perfil");

        const data = await response.json();
        console.log("🔍 Dados do usuário recebidos:", data); // 🔥 DEBUG
        setUser(data);

        const planResponse = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/get_user_plan`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!planResponse.ok) throw new Error("Erro ao carregar plano");

        const planData = await planResponse.json();
        console.log("📢 Plano recebido:", planData); // 🔥 DEBUG
        setPlan(planData.plan);
      } catch (error) {
        setError("Erro ao carregar dados do usuário");
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token, user?.subscription_canceled]); // ✅ Agora recarrega corretamente




  const handleSelectPlan = async (plan) => {
    if (!plan) {
      alert("Plano inválido selecionado.");
      return;
    }

    setSelectedPlan(plan);

    if (plan.priceId) {
      setShowPlanPopup(false);
      setTimeout(() => setShowPaymentPopup(true), 300);
    } else {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/change_plan`, {
          method: "POST",
          body: JSON.stringify({ plan: plan.name }), // 🔥 Enviando o plano correto?
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Erro ao ativar plano gratuito.");

        alert(`Plano ${plan.name} ativado!`);
        setPlan(plan.name);
        setUser((prevUser) => ({
          ...prevUser,
          subscription_canceled: false, // ✅ Garantindo atualização local
        }));
        setShowPlanPopup(false);
      } catch (error) {
        alert("Erro ao ativar plano gratuito.");
      }
    }
  };

  const handlePaymentSuccess = (newPlan) => {
  setShowPaymentPopup(false);
  setPlan(newPlan);
  window.location.reload(); // 🔥 Atualiza a página para pegar os dados certos
};

  const handleCancelSubscription = async () => {
    if (!window.confirm("Tem certeza que deseja cancelar sua assinatura?")) return;

    try {
      const res = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/payments/cancel_subscription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        window.location.reload(); // 🔄 Recarrega a página inteira
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Erro ao cancelar a assinatura:", error);
      alert("Erro ao cancelar a assinatura.");
    }
  };


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
              src={user.avatar || "https://res.cloudinary.com/dcvtrregd/image/upload/v1736802678/user_1_vl6pae.png"}
              alt="Profile Picture"
            />
          </div>

          {/* Profile information */}
          <div className="profile-details">
            <p>
              <strong>Name:</strong> {user.first_name} {user.last_name}
            </p>
            <p>
              <strong>Date of Birth:</strong> {user.birthdate || "dd/mm/yyyy"}
            </p>
            <p>
              <strong>Gender:</strong> {user.gender || "Not specified"}
            </p>
            <p>
              <strong>Phone:</strong> {user.phone_number || "Not specified"}
            </p>
            <p>
              <strong>Address:</strong> {user.address || "Not specified"}
            </p>
            <div className="subscription-container">
            <div className="subscription-header">
              <p><strong>Plano:</strong> {plan}</p>
              {user?.subscription_end && new Date(user.subscription_end) > new Date() && !user?.subscription_canceled && (
                <p className="subscription-status">
                  <strong>Expira em:</strong> {new Date(user.subscription_end).toLocaleDateString()}
                </p>
              )}
              {user?.plan !== "Basic" && user?.subscription_end && new Date(user.subscription_end) > new Date() && !user?.subscription_canceled && (
                <button onClick={handleCancelSubscription} className="cancel-btn">
                  Cancelar Assinatura
                </button>
              )}
            </div>

            {user?.plan !== "Basic" && user?.subscription_canceled && (
              <p className="subscription-warning">
                🚨 Sua assinatura foi cancelada e <strong>não será renovada após</strong> {new Date(user.subscription_end).toLocaleDateString()}.
              </p>
            )}

            <button onClick={() => setShowPlanPopup(true)} className="upgrade-btn">
              🔼 Upgrade de Plano
            </button>

          </div>
            {showPlanPopup && (
              <div className="popup-overlay">
                <div className="popup-content">
                  <SubscriptionPlans onSelectPlan={handleSelectPlan} onClose={() => setShowPlanPopup(false)} />
                </div>
              </div>
            )}

            {showPaymentPopup && selectedPlan && (
              <div className="popup-overlay">
                <div className="popup-content1">
                <SavePaymentMethod
  selectedPlan={selectedPlan}
  onPaymentSuccess={() => handlePaymentSuccess(selectedPlan.name)}
/>

                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
