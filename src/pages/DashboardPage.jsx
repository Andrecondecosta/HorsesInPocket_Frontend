import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import CardSection from '../components/CardSection';
import HistoryTable from '../components/HistoryTable';
import WelcomePopup from '../components/WelcomePopup';
import './DashboardPage.css';

const DashboardPage = ({ setIsLoggedIn }) => {
  const [showPopup, setShowPopup] = useState(false);

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
