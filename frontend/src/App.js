import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js'; // Importando somente o Elements do pacote correto
import { loadStripe } from '@stripe/stripe-js'; // Cor
import Content from './components/Content';
import './App.css';

// Chave pública do Stripe (Substitua pela sua chave pública do Stripe)
const stripePromise = loadStripe('pk_test_51QkXlvDCGWh9lQnCSHm6pqy2GUvnhRILeLKYSSLsAPjAWfLpzG4S2NKVxGuW89ZJO4cGu08DBuRLNzEFPBs61PpJ00MLiQj0qD');

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    // Envolvendo a aplicação com o contexto do Stripe
    <Router>
      <div className="app-container">
        <Elements stripe={stripePromise}>
          <Content setIsLoggedIn={setIsLoggedIn} />
        </Elements>
      </div>
    </Router>
  );
}

export default App;
