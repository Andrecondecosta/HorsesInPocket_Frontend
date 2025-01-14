import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRegister } from '../hooks/useRegister.js';
import './RegisterPage.css';

const RegisterPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');

  const { register, token, loading, error } = useRegister();
  const navigate = useNavigate();

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
    };

    const receivedToken = await register(userData);

    if (receivedToken) {
      navigate('/login');
    } else {
      console.error('Registo falhou: Token não foi recebido.');
    }
  };

  return (
    <div className="register-page">
      {/* Lado esquerdo com a imagem */}
      <div className="register-image"></div>

      {/* Lado direito com o formulário */}
      <div className="register-container">
        <div className="register-header">
        <img src="https://res.cloudinary.com/dcvtrregd/image/upload/v1736812812/HorsesInPocket/HorsesInPocket/FullLogo_Transparent_2_pm6gp2.png" alt="HorsesInPocket Logo" className="register-logo-image" />
          <h2>Registo</h2>
        </div>

        {error && <p className="error-message">{error}</p>}

        <form className="register-form" onSubmit={handleSubmit}>
          <input
            className="half-width"
            type="text"
            placeholder="Nome"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            className="half-width"
            type="text"
            placeholder="Apelido"
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
            <option value="">Género</option>
            <option value="male">Masculino</option>
            <option value="female">Feminino</option>
            <option value="other">Outro</option>
          </select>
          <input
            className="half-width"
            type="date"
            placeholder="Data de Nascimento"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            required
          />
          <input
            className="half-width"
            type="tel"
            placeholder="Telefone"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <input
            className="half-width"
            type="text"
            placeholder="Endereço"
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
            placeholder="Confirmar Password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
          />
          <button type="submit" className="register-button" disabled={loading}>
            {loading ? 'A Registar...' : 'Registar'}
          </button>
        </form>

        <p className="login-message">
          Já tem Conta? <Link to="/login">Efetue o Login</Link>.
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
