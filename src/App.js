import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Menu from './components/Menu';
import Content from './components/Content';
import './App.css';
import Footer from './components/Footer';

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
      <Menu isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /> {/* Passa isLoggedIn e setIsLoggedIn como props */}
      <Content setIsLoggedIn={setIsLoggedIn} /> {/* Passa setIsLoggedIn como prop */}
      <Footer />
      </div>
    </Router>
  );
}

export default App;
