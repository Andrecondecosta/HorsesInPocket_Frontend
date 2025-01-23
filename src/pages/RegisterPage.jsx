import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRegister } from '../hooks/useRegister.js';
import './RegisterPage.css';

const RegisterPage = ({ setIsLoggedIn }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');
  const [error, setError] = useState(null);

  const { register, loading} = useRegister();
  const navigate = useNavigate();

  const params = new URLSearchParams(window.location.search);
  const redirectUrl = params.get('redirect');
  const token = params.get('token'); // Token enviado no link compartilhado

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      password_confirmation: passwordConfirmation,
      birthdate,
      phone_number: phoneNumber,
      address,
      gender,
      token,
    };

    try {
      const success = await register(userData);

      if (success) {
        setIsLoggedIn(true);

        // Redireciona para o URL especificado ou página padrão
        if (redirectUrl) {
          navigate(redirectUrl);
        } else {
          navigate('/received');
        }
      }
    } catch (err) {
      setError(err.message);
    }
  };


  return (
    <div className="register-page">
      {/* Left side with the image */}
      <div className="register-image"></div>

      {/* Right side with the form */}
      <div className="register-container">
        <div className="register-header">
          <img
            src="https://res.cloudinary.com/dcvtrregd/image/upload/v1736812812/HorsesInPocket/HorsesInPocket/FullLogo_Transparent_2_pm6gp2.png"
            alt="HorsesInPocket Logo"
            className="register-logo-image"
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <form className="register-form" onSubmit={handleSubmit}>
          <input
            className="half-width"
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            className="half-width"
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <select
            className="half-width"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="">Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <input
            className="half-width"
            type="date"
            placeholder="Date of Birth"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            required
          />
          <input
            className="half-width"
            type="tel"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <input
            className="half-width"
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <input
            className="full-width"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="half-width"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            className="half-width"
            type="password"
            placeholder="Confirm Password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
          />
          <button type="submit" className="register-button" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="login-message">
          Already have an account? <Link to="/login">Log In</Link>.
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
