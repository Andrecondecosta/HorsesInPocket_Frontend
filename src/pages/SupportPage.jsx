import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SupportPage.css';

const SupportPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    window.location.href = `mailto:horsehub2025@gmail.com?subject=Support Request from ${name}&body=${message}%0A%0AFrom: ${name} (${email})`;
    setSent(true);
  };

  return (
    <div className="support-page">
      <div className="support-container">
        <div className="support-header">
          <img
            src="https://res.cloudinary.com/dcvtrregd/image/upload/v1736812812/HorsesInPocket/HorsesInPocket/FullLogo_Transparent_2_pm6gp2.png"
            alt="HorsesInPocket"
            className="support-logo"
          />
          <h1>Support</h1>
          <p>We're here to help. Send us a message and we'll get back to you as soon as possible.</p>
        </div>

        <div className="support-content">
          <div className="support-info">
            <div className="support-info-item">
              <span className="support-info-icon">📧</span>
              <div>
                <strong>Email</strong>
                <p><a href="mailto:horsehub2025@gmail.com">horsehub2025@gmail.com</a></p>
              </div>
            </div>
            <div className="support-info-item">
              <span className="support-info-icon">📄</span>
              <div>
                <strong>Privacy Policy</strong>
                <p><Link to="/privacy-policy">View our Privacy Policy</Link></p>
              </div>
            </div>
            <div className="support-info-item">
              <span className="support-info-icon">📱</span>
              <div>
                <strong>App Version</strong>
                <p>HorsesInPocket v1.0</p>
              </div>
            </div>
          </div>

          <form className="support-form" onSubmit={handleSubmit}>
            <h2>Send a Message</h2>
            {sent ? (
              <div className="support-success">
                <p>Thank you! Your email client has been opened with your message pre-filled.</p>
              </div>
            ) : (
              <>
                <div className="support-field">
                  <label>Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div className="support-field">
                  <label>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div className="support-field">
                  <label>Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your issue or question..."
                    rows={5}
                    required
                  />
                </div>
                <button type="submit">Send Message</button>
              </>
            )}
          </form>
        </div>

        <div className="support-footer">
          <Link to="/login">Back to Login</Link>
          <span>·</span>
          <Link to="/privacy-policy">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
