import React from 'react';
import './PrivacyPolicy.css';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

    const handleBackToRegister = () => {
    navigate('/register'); // ✅ Ajusta o caminho se a tua rota de registo for diferente
  };

  return (
    <div className="page-container">
      <div className="page-content">
        <h1 className="page-title">Privacy Policy</h1>
        <p className="page-date">Last updated: <strong>22/12/2024</strong></p>

        <p className="page-text">
          At <strong>HorseHub</strong>, your privacy is a top priority. This Privacy Policy explains how we collect, use, share, and protect your personal information when you use our platform.
        </p>

        <h2 className="page-section-title">1. Information We Collect</h2>
        <ul className="page-list">
          <li><strong>Personal Information:</strong> Name, email address, phone number, and account credentials.</li>
          <li><strong>Horse Data:</strong> Details you add about horses, including name, age, photos, and videos.</li>
          <li><strong>Usage Data:</strong> Actions performed on the platform, such as horses created, shared, or received.</li>
          <li><strong>Technical Data:</strong> IP address, browser type, device information, and cookies.</li>
        </ul>

        <h2 className="page-section-title">2. How We Use Your Data</h2>
        <p className="page-text">
          We use your information to:
        </p>
        <ul className="page-list">
          <li>Provide and improve our services.</li>
          <li>Enable you to share horse profiles securely using tokenized links.</li>
          <li>Send important notifications about your account.</li>
          <li>Ensure the safety and integrity of the platform.</li>
        </ul>

        <h2 className="page-section-title">3. Sharing Information</h2>
        <p className="page-text">
          We do not sell your data. Information may be shared with:
        </p>
        <ul className="page-list">
          <li>Trusted partners for technical operations (e.g., hosting services).</li>
          <li>Other users, when you share horse profiles via tokenized links. These links are secured with unique tokens and may expire for added security.</li>
          <li>Authorities, if legally required.</li>
        </ul>

        <h2 className="page-section-title">4. Cookies</h2>
        <p className="page-text">
          We use cookies to personalize your experience, analyze traffic, and remember preferences.
        </p>

        <h2 className="page-section-title">5. Data Security</h2>
        <p className="page-text">
          We implement appropriate technical measures to protect your data. However, no system is completely secure.
        </p>

        <h2 className="page-section-title">6. Your Rights</h2>
        <p className="page-text">
          Under GDPR, you have the right to access, modify, or delete your personal data. To exercise your rights, please contact us at:
        </p>
        <p className="page-contact">📧 horsehub2025@gmail.com</p>

        <h2 className="page-section-title">7. Privacy for Minors</h2>
        <p className="page-text">
          HorseHub is not intended for users under 16 years old. We do not knowingly collect data from children.
        </p>

        <h2 className="page-section-title">8. Changes to This Policy</h2>
        <p className="page-text">
          We may update this Privacy Policy from time to time. Changes will be notified via the platform or email.
        </p>

        <h2 className="page-section-title">9. Contact Us</h2>
        <p className="page-text">
          If you have questions about this Privacy Policy, contact us at:
        </p>
        <p className="page-contact">📧 horsehub2025@gmail.com</p>

           {/* ✅ Botão para voltar ao registo */}
        <div className="back-to-register">
          <p className="page-text">
            Ready to create your account? You can return to the registration page now.
          </p>
          <button
            className="back-button"
            onClick={handleBackToRegister}
          >
            Back to Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
