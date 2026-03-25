import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { App as CapacitorApp } from '@capacitor/app';
import Content from './components/Content';
import './App.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

// Interceptor global: redireciona para login em qualquer resposta 401 com token ativo
const _originalFetch = window.fetch;
window.fetch = async (...args) => {
  const response = await _originalFetch(...args);
  if (response.status === 401 && localStorage.getItem('authToken')) {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  }
  return response;
};

// Handles incoming deep links (Universal Links / App Links) and routes inside React
function DeepLinkHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    let listener;

    CapacitorApp.addListener('appUrlOpen', (event) => {
      try {
        const url = new URL(event.url);
        const path = url.pathname + url.search;
        if (path) navigate(path);
      } catch (e) {
    console.warn('Deep link parse error:', e);
      }
    }).then((l) => {
      listener = l;
    });

    return () => {
      listener?.remove();
    };
  }, [navigate]);

  return null;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      <div className="app-container">
        <DeepLinkHandler />
        <Elements stripe={stripePromise}>
          <Content setIsLoggedIn={setIsLoggedIn} />
        </Elements>
      </div>
    </Router>
  );
}

export default App;
