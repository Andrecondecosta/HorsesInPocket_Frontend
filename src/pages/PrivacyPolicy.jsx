import React from 'react';
import './PrivacyPolicy.css';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  const handleBackToRegister = () => {
    navigate('/register');
  };

  return (
    <div className="page-container">
      <div className="page-content">
        <h1 className="page-title">Privacy Policy</h1>
        <p className="page-date">Last updated: <strong>01/01/2026</strong></p>

        <p className="page-text">
          At <strong>HorsesInPocket</strong>, your privacy is a top priority. This Privacy Policy explains how we collect, use, share, and protect your personal information when you use our platform and mobile application.
        </p>

        <h2 className="page-section-title">1. Information We Collect</h2>
        <ul className="page-list">
          <li><strong>Personal Information:</strong> Name, email address, phone number, date of birth, gender, country, and account credentials.</li>
          <li><strong>Horse Data:</strong> Details you add about horses, including name, age, breed, photos, videos, and genealogy information.</li>
          <li><strong>Usage Data:</strong> Actions performed on the platform, such as horses created, shared, or received.</li>
          <li><strong>Technical Data:</strong> IP address, browser type, device information, operating system, and app version.</li>
          <li><strong>Camera & Photos:</strong> If you grant permission, we access your camera and photo library solely to let you upload horse profile images and videos.</li>
        </ul>

        <h2 className="page-section-title">2. How We Use Your Data</h2>
        <p className="page-text">We use your information to:</p>
        <ul className="page-list">
          <li>Provide, operate, and improve our services.</li>
          <li>Enable you to share horse profiles securely using tokenized links.</li>
          <li>Send important notifications about your account and horse activity.</li>
          <li>Ensure the safety and integrity of the platform.</li>
          <li>Comply with legal obligations.</li>
        </ul>

        <h2 className="page-section-title">3. Sharing Information</h2>
        <p className="page-text">We do not sell your data. Information may be shared with:</p>
        <ul className="page-list">
          <li>Trusted partners for technical operations (e.g., hosting services, cloud storage).</li>
          <li>Other users, only when you explicitly share horse profiles via tokenized links. These links are secured with unique tokens and may expire for added security.</li>
          <li>Authorities, if legally required.</li>
        </ul>

        <h2 className="page-section-title">4. Data Retention</h2>
        <p className="page-text">
          We retain your personal data for as long as your account is active or as needed to provide services. You may request deletion of your account and associated data at any time by contacting us.
        </p>

        <h2 className="page-section-title">5. Cookies</h2>
        <p className="page-text">
          We use cookies and similar technologies to personalize your experience, analyze traffic, and remember preferences. You may disable cookies in your browser settings, though some features may not function properly.
        </p>

        <h2 className="page-section-title">6. Data Security</h2>
        <p className="page-text">
          We implement appropriate technical and organizational measures to protect your data, including encrypted connections (HTTPS) and secure token-based authentication. However, no system is completely secure.
        </p>

        <h2 className="page-section-title">7. Your Rights (GDPR)</h2>
        <p className="page-text">Under GDPR and applicable law, you have the right to:</p>
        <ul className="page-list">
          <li>Access the personal data we hold about you.</li>
          <li>Correct inaccurate or incomplete data.</li>
          <li>Request deletion of your data ("right to be forgotten").</li>
          <li>Object to or restrict processing of your data.</li>
          <li>Data portability.</li>
        </ul>
        <p className="page-text">To exercise your rights, please contact us at:</p>
        <p className="page-contact">📧 horsehub2025@gmail.com</p>

        <h2 className="page-section-title">8. Privacy for Minors</h2>
        <p className="page-text">
          HorsesInPocket is not intended for users under 16 years old. We do not knowingly collect personal data from children. If you believe a child has provided us with their data, please contact us immediately.
        </p>

        <h2 className="page-section-title">9. Third-Party Services</h2>
        <p className="page-text">
          Our platform may use third-party services (such as cloud hosting, payment processors, and analytics). These services have their own privacy policies, and we encourage you to review them.
        </p>

        <h2 className="page-section-title">10. Changes to This Policy</h2>
        <p className="page-text">
          We may update this Privacy Policy from time to time. We will notify you of significant changes via the platform or email. Continued use of the app after changes constitutes acceptance of the updated policy.
        </p>

        <h2 className="page-section-title">11. Contact Us</h2>
        <p className="page-text">
          If you have questions or concerns about this Privacy Policy, please contact us:
        </p>
        <p className="page-contact">📧 horsehub2025@gmail.com</p>

        <div className="back-to-register">
          <p className="page-text">
            Ready to create your account? You can return to the registration page now.
          </p>
          <button className="back-button" onClick={handleBackToRegister}>
            Back to Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
