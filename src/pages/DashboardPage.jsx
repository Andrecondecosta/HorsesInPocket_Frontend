import React from 'react';
import Layout from '../components/Layout';
import CardSection from '../components/CardSection';
import HistoryTable from '../components/HistoryTable';
import './DashboardPage.css';

const DashboardPage = ( ) => {
  return (
    <Layout>
      <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard</h2>
        <CardSection />
        <HistoryTable />
      </div>
    </Layout>
  );
};

export default DashboardPage;
