import React, { useEffect } from 'react';
import Layout from '../components/Layout';
import CardSection from '../components/CardSection';
import HistoryTable from '../components/HistoryTable';
import './DashboardPage.css';

const DashboardPage = ({ setIsLoggedIn }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout setIsLoggedIn={setIsLoggedIn}>
      <div className="dashboard-container">
        <h2 className="page-title">Dashboard</h2>
        <CardSection />
        <HistoryTable />
      </div>
    </Layout>
  );
};

export default DashboardPage;
