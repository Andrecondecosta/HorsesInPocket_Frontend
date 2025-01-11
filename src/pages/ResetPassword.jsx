import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ForgotPassword.css'; // Reutilizamos o mesmo CSS do ForgotPassword

const ResetPassword = () => {
  const { token } = useParams(); // Captura o token da URL
  const navigate = useNavigate(); // Hook para redirecionar
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Token enviado:", token);

    if (password !== confirmPassword) {
      setMessage('As senhas não coincidem.');
      setSuccess(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/password/reset`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      if (response.ok) {
        setMessage('Senha redefinida com sucesso!');
        setSuccess(true);

        // Redireciona para a página de login após 3 segundos
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || 'Erro ao redefinir a senha. Tente novamente.');
        setSuccess(false);
      }
    } catch (error) {
      setMessage('Ocorreu um erro. Por favor, tente novamente.');
      setSuccess(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <h2>Redefinir Senha</h2>
        {message && <p className={`message ${success ? 'success' : 'error'}`}>{message}</p>}
        {!success && (
          <form className="forgot-password-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Nova Senha:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua nova senha"
                required
              />
            </div>
            <div className="input-group">
              <label>Confirmar Nova Senha:</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme sua nova senha"
                required
              />
            </div>
            <button type="submit">Redefinir Senha</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
