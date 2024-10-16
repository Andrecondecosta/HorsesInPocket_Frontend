import React, { useState } from 'react';
import { useRegister } from '../hooks/useRegister.js';

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

  const handleSubmit = (e) => {
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

    // Passando todos os dados para o hook register
    register(userData);
  };

  return (
    <div>
      <h2>Registro</h2>
      {loading && <p>Carregando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Sobrenome"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          required
        />
        <select
          value={gender}
          onChange={e => setGender(e.target.value)}
        >
          <option value="">Selecionar Gênero</option>
          <option value="male">Masculino</option>
          <option value="female">Feminino</option>
          <option value="other">Outro</option>
        </select>
        <input
          type="password"
          placeholder="Confirmação de Senha"
          value={passwordConfirmation}
          onChange={e => setPasswordConfirmation(e.target.value)}
          required
        />
        <input
          type="date"
          placeholder="Data de Nascimento"
          value={birthdate}
          onChange={e => setBirthdate(e.target.value)}
        />
        <input
          type="text"
          placeholder="Telefone"
          value={phoneNumber}
          onChange={e => setPhoneNumber(e.target.value)}
        />
        <input
          type="text"
          placeholder="Endereço"
          value={address}
          onChange={e => setAddress(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>Registrar</button>
      </form>
      {token && <p>Token: {token}</p>}
    </div>
  );
};

export default RegisterPage;
