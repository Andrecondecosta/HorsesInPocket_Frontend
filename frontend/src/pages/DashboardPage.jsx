import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import CardSection from '../components/CardSection';
import HistoryTable from '../components/HistoryTable';
import WelcomePopup from '../components/WelcomePopup';
import './DashboardPage.css';


const DashboardPage = ({ setIsLoggedIn }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [userStatus, setUserStatus] = useState({});
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls to the top when the component is mounted

    const hasSeenPopup = localStorage.getItem("hasSeenPopup");
  console.log("📌 Valor inicial de hasSeenPopup:", hasSeenPopup);

  if (hasSeenPopup === "newUser") {
    console.log("✅ Exibindo popup pela primeira vez...");
    setShowPopup(true);
    localStorage.setItem("hasSeenPopup", "true"); // 🔥 Define como visto após exibir
  } else {
    console.log("🚫 Popup já foi visto antes, não exibindo.");
  }
}, []);

useEffect(() => {
  const fetchUserStatus = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/user_status`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Erro ao carregar status do usuário");

      const data = await response.json();
      setUserStatus(data);
    } catch (error) {
      console.error("Erro ao buscar status do usuário:", error);
    }
  };

  if (token) {
    fetchUserStatus();
  }
}, [token]);


  return (
    <Layout setIsLoggedIn={setIsLoggedIn}>
      {/* O popup só aparece se showPopup for true */}
      {showPopup && <WelcomePopup onClose={() => setShowPopup(false)} />}

      <div className="dashboard-container">
        <h2 className="page-title">Dashboard</h2>
        <CardSection /> {/* Section displaying cards */}
        <HistoryTable /> {/* Table showing history */}
      </div>
    </Layout>
  );
};

export default DashboardPage;
