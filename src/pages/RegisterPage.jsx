import React, { useState, useEffect } from 'react';
import { useNavigate, Link} from 'react-router-dom';
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
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('');
  const [gender, setGender] = useState('');
  const [sharedToken, setSharedToken] = useState(null); // Estado para armazenar o token compartilhado
  const [acceptPrivacyPolicy, setAcceptPrivacyPolicy] = useState(false); // Estado para aceitar a Política de Privacidade

  const { register, token, loading, error } = useRegister();
  const navigate = useNavigate();

  // Captura o token da URL quando a página de registro é carregada
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromURL = urlParams.get('token');
    console.log('Captured token from URL:', tokenFromURL); // Log para verificar se o token está correto
    setSharedToken(tokenFromURL); // Atualiza o estado com o token da URL

    const fetchCountries = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/countries`);
        if (!response.ok) throw new Error('Erro ao carregar países');
        const data = await response.json();

        console.log('Países carregados:', data); // 👀 Depuração
        setCountries(Array.isArray(data) ? data : []); // ✅ Garantir que seja um array
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchCountries();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verifica se o utilizador aceitou a Política de Privacidade
    // ✅ Verifica se o utilizador aceitou a Política de Privacidade
    if (!acceptPrivacyPolicy) {
      alert('You must accept the Privacy Policy to register.');
      return;
    }
    // Cria o objeto com os dados do utilizador
    const userData = {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      password_confirmation: passwordConfirmation,
      birthdate,
      phone_number: phoneNumber,
      country,
      gender,
    };

    // Enviar o token de compartilhamento junto com os dados do usuário
    const receivedToken = await register(userData, sharedToken || null); // Passando o token compartilhado para a requisição

    if (receivedToken) {
      navigate('/login');
    } else {
      console.error('Registration failed: Token was not received.');
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
          <select
            className="half-width"
            value={country} onChange={(e) => setCountry(e.target.value)} required>
            <option value="">Selecione um País</option>
               {countries.map((c) => (
            <option key={c.code} value={c.code}>{c.name}</option>
             ))}
          </select>
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
          {/* ✅ Checkbox da Política de Privacidade */}
          <div className="privacy-checkbox">
            <input
              type="checkbox"
              id="acceptPrivacyPolicy"
              checked={acceptPrivacyPolicy}
              onChange={(e) => setAcceptPrivacyPolicy(e.target.checked)}
              required
            />
            <label htmlFor="acceptPrivacyPolicy">
              I accept the{' '}
              <Link to="/privacy-policy" className="privacy-link">
                Privacy Policy
              </Link>
            </label>
          </div>
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
