import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app';
import Content from './components/Content';
import InstallPrompt from './components/InstallPrompt';
import usePushNotifications from './hooks/usePushNotifications';
import './App.css';

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

  return (
    <Router>
      <div className="app-container">
        <DeepLinkHandler />
        <InstallPrompt />
        <Content setIsLoggedIn={setIsLoggedIn} />
      </div>
    </Router>
  );
}

export default App;
