import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

import { useLogin } from '../hooks/useLogin';
import AuthLayout, { AuthField, FormMessage, PasswordInput, TextLink } from '../components/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const LoginPage = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sharedToken, setSharedToken] = useState(null);
  const { login, loading, error } = useLogin();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Captura o shared_token da URL (vem do link de partilha, via página de boas-vindas)
  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setSharedToken(tokenFromUrl);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await login(email, password, sharedToken);

    if (localStorage.getItem('authToken')) {
      setIsLoggedIn(true);

      const redirectUrl = searchParams.get('redirect');
      if (redirectUrl) {
        navigate(redirectUrl);
      } else {
        navigate('/dashboard');
      }
    }
  };

  // O link de registo mantém o token de partilha, para o cavalo chegar à conta nova
  const registerHref = sharedToken ? `/register?token=${encodeURIComponent(sharedToken)}` : '/register';

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Log in"
      description={sharedToken ? 'Log in to see the horse shared with you.' : 'Your private horse portfolio.'}
      footer={
        <p>
          Don't have an account? <TextLink to={registerHref}>Sign up</TextLink>
        </p>
      }
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <AuthField id="login-email" label="Email">
          <Input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            inputMode="email"
            autoCapitalize="none"
            required
          />
        </AuthField>
        <AuthField
          id="login-password"
          label="Password"
          aside={<TextLink to="/forgot/password" className="text-[13px] font-medium">Forgot password?</TextLink>}
        >
          <PasswordInput
            id="login-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </AuthField>
        <FormMessage>{error}</FormMessage>
        <Button type="submit" size="xl" disabled={loading} className="mt-1">
          {loading && <Loader2 className="animate-spin" aria-hidden="true" />}
          {loading ? 'Logging in…' : 'Log in'}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
