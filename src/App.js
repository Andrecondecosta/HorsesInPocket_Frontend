import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { App as CapacitorApp } from '@capacitor/app';
import Content from './components/Content';
import usePushNotifications from './hooks/usePushNotifications';
import { isNativeiOS } from './utils/isNative';
import './App.css';

// Only load Stripe when NOT on native iOS (App Store compliance)
const stripePromise = isNativeiOS() ? null : loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

// Global interceptor: redirect to login on any 401 response with active token
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
  const [, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) setIsLoggedIn(true);
  }, []);

  // Register for push notifications when user is logged in (iOS only)
  usePushNotifications();

  const content = <Content setIsLoggedIn={setIsLoggedIn} />;

  return (
    <Router>
      <div className="app-container">
        <DeepLinkHandler />
        {stripePromise ? (
          <Elements stripe={stripePromise}>
            {content}
          </Elements>
        ) : (
          content
        )}
      </div>
    </Router>
  );
}

export default App;
