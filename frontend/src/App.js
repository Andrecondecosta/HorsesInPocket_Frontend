import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js'; // Importando somente o Elements do pacote correto
import { loadStripe } from '@stripe/stripe-js'; // Cor
import Content from './components/Content';
import './App.css';

// Chave pública do Stripe vem da variável de ambiente
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

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
