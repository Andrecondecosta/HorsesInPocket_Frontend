import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

import AuthLayout, { AuthField, FormMessage, PasswordInput, TextLink } from '../components/AuthLayout';
import { Button } from '@/components/ui/button';

const ResetPassword = () => {
  const { token } = useParams(); // Token do email de recuperação
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      setSuccess(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/password/reset`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      if (response.ok) {
        setMessage('Password reset successfully!');
        setSuccess(true);

        // Volta ao login 3 s depois
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Password recovery"
      title="New password"
      description="Choose a new password for your account."
      footer={
        <p>
          <TextLink to="/login">Back to log in</TextLink>
        </p>
      }
    >
      {success ? (
        <FormMessage type="success">{message} Redirecting to log in…</FormMessage>
      ) : (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <AuthField id="reset-password" label="New password">
            <PasswordInput id="reset-password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" required />
          </AuthField>
          <AuthField id="reset-password-confirmation" label="Confirm new password">
            <PasswordInput
              id="reset-password-confirmation"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </AuthField>
          <FormMessage>{message}</FormMessage>
          <Button type="submit" size="xl" disabled={loading}>
            {loading && <Loader2 className="animate-spin" aria-hidden="true" />}
            {loading ? 'Saving…' : 'Reset password'}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
};

export default ResetPassword;
