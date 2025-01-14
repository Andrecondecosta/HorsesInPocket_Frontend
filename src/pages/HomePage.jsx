import React from 'react';
import { Link } from 'react-router-dom';

import './HomePage.css';

const HomePage = () => {
  return (
      <div className="homepage-container">
        {/* Hero Section */}
        <div className="hero-section">
          <h1 className="hero-title">Welcome to HorseHub</h1>
          <p className="hero-description">
            Manage, connect, and share information about horses easily and efficiently.
            HorseHub offers a complete solution for breeders and horse enthusiasts.
          </p>
          <Link to="/login" className="hero-button">
            Get Started Now
          </Link>
        </div>

        {/* Features Section */}
        <div className="features-section">
          <h2 className="section-title">What We Offer</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Comprehensive Management</h3>
              <p>
                Organize your horses' profiles with details like images, videos, and genealogies, all in one place.
              </p>
            </div>
            <div className="feature-card">
              <h3>Simplified Sharing</h3>
              <p>
                Share information quickly and securely via email or unique links.
              </p>
            </div>
            <div className="feature-card">
              <h3>Full Control and Security</h3>
              <p>
                Monitor all actions taken, ensuring you have control over your data.
              </p>
            </div>
            <div className="feature-card">
              <h3>Access on Any Device</h3>
              <p>
                Easily navigate from anywhere, whether on a computer, tablet, or smartphone.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="cta-section">
          <h2>Join Us Now!</h2>
          <p>
            Discover how Horses in Pocket can transform the way you manage, share,
            and connect with horses. Whether you're an experienced breeder or a passionate enthusiast, we have the perfect solution for you.
          </p>
          <Link to="/register" className="cta-button">
            Create Account
          </Link>
        </div>
      </div>

  );
};

export default HomePage;
