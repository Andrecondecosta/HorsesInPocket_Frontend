import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

import AuthLayout, { AuthField, FormMessage, TextLink } from '../components/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/password/forgot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error sending recovery email.');
      }

      setSuccessMessage('Recovery email sent successfully! Please check your inbox.');
      setTimeout(() => { navigate('/login'); }, 5000);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Password recovery"
      title="Forgot password?"
      description="Enter your email and we will send you a link to choose a new password."
      footer={
        <p>
          Remembered it? <TextLink to="/login">Log in</TextLink>
        </p>
      }
    >
      {successMessage ? (
        <FormMessage type="success">{successMessage}</FormMessage>
      ) : (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <AuthField id="forgot-email" label="Email">
            <Input
              id="forgot-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              inputMode="email"
              autoCapitalize="none"
              required
            />
          </AuthField>
          <FormMessage>{errorMessage}</FormMessage>
          <Button type="submit" size="xl" disabled={loading}>
            {loading && <Loader2 className="animate-spin" aria-hidden="true" />}
            {loading ? 'Sending…' : 'Send recovery email'}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;
