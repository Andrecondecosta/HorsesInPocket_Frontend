import React, { useState } from 'react';
import { useRegister } from '../hooks/useRegister.js';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const { register, token, loading, error } = useRegister();

  const handleSubmit = (e) => {
    e.preventDefault();
    register(email, password, passwordConfirmation);
  };

  return (
    <div>
      <h2>Registro</h2>
      {loading && <p>Carregando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirmação de Senha"
          value={passwordConfirmation}
          onChange={e => setPasswordConfirmation(e.target.value)}
        />
        <button type="submit" disabled={loading}>Registrar</button>
      </form>
      {token && <p>Token: {token}</p>}
    </div>
  );
};

export default RegisterPage;
