import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ForgotPassword.css'; // Reusing the ForgotPassword CSS

const ResetPassword = () => {
  const { token } = useParams(); // Capture the token from the URL
  const navigate = useNavigate(); // Hook for navigation
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Token sent:', token);

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
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
        setMessage('Password reset successfully!');
        setSuccess(true);

        // Redirect to login page after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || 'Failed to reset password. Please try again.');
        setSuccess(false);
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
      setSuccess(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <h2>Reset Password</h2>
        {message && <p className={`message ${success ? 'success' : 'error'}`}>{message}</p>}
        {!success && (
          <form className="forgot-password-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label>New Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your new password"
                required
              />
            </div>
            <div className="input-group">
              <label>Confirm New Password:</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                required
              />
            </div>
            <button type="submit">Reset Password</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
