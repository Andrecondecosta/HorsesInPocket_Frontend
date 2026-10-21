import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

import { useRegister } from '../hooks/useRegister.js';
import AuthLayout, { AuthField, FormMessage, PasswordInput, TextLink } from '../components/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NativeSelect } from '@/components/ui/native-select';

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
  const [sharedToken, setSharedToken] = useState(null);
  const [acceptPrivacyPolicy, setAcceptPrivacyPolicy] = useState(false);
  const [formError, setFormError] = useState(null);

  const { register, loading, error } = useRegister();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const tokenFromURL = searchParams.get('token');
    setSharedToken(tokenFromURL);

    const fetchCountries = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/countries`);
        if (!response.ok) throw new Error('Error loading countries');
        const data = await response.json();

        setCountries(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchCountries();
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    // A política de privacidade tem de ser aceite (antes era um alert())
    if (!acceptPrivacyPolicy) {
      setFormError('You must accept the Privacy Policy to register.');
      return;
    }

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

    // O token de partilha segue com o registo, para o cavalo chegar à conta nova
    const receivedToken = await register(userData, sharedToken || null);

    if (receivedToken) {
      navigate('/dashboard');
    } else {
      console.error('Registration failed: Token was not received.');
    }
  };

  const loginHref = sharedToken ? `/login?token=${encodeURIComponent(sharedToken)}` : '/login';

  return (
    <AuthLayout
      wide
      eyebrow="Free account"
      title="Create account"
      description={sharedToken ? 'Create your account to see the horse shared with you.' : 'Start your private horse portfolio.'}
      footer={
        <p>
          Already have an account? <TextLink to={loginHref}>Log in</TextLink>
        </p>
      }
    >
      <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
        <AuthField id="register-first-name" label="First name">
          <Input id="register-first-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} autoComplete="given-name" required />
        </AuthField>
        <AuthField id="register-last-name" label="Last name">
          <Input id="register-last-name" value={lastName} onChange={(e) => setLastName(e.target.value)} autoComplete="family-name" required />
        </AuthField>
        <AuthField id="register-gender" label="Gender">
          <NativeSelect id="register-gender" value={gender} onChange={(e) => setGender(e.target.value)} required>
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </NativeSelect>
        </AuthField>
        <AuthField id="register-birthdate" label="Date of birth">
          <Input id="register-birthdate" type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} autoComplete="bday" required />
        </AuthField>
        <AuthField id="register-phone" label="Phone · optional">
          <Input id="register-phone" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} autoComplete="tel" />
        </AuthField>
        <AuthField id="register-country" label="Country">
          <NativeSelect id="register-country" value={country} onChange={(e) => setCountry(e.target.value)} autoComplete="country-name" required>
            <option value="">Select a country</option>
            {countries.map((c) => (
              <option key={c.code} value={c.name}>{c.name}</option>
            ))}
          </NativeSelect>
        </AuthField>
        <AuthField id="register-email" label="Email" className="sm:col-span-2">
          <Input
            id="register-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            inputMode="email"
            autoCapitalize="none"
            required
          />
        </AuthField>
        <AuthField id="register-password" label="Password">
          <PasswordInput id="register-password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" required />
        </AuthField>
        <AuthField id="register-password-confirmation" label="Confirm password">
          <PasswordInput
            id="register-password-confirmation"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            autoComplete="new-password"
            required
          />
        </AuthField>

        <label htmlFor="acceptPrivacyPolicy" className="flex items-start gap-2.5 text-sm sm:col-span-2">
          <input
            type="checkbox"
            id="acceptPrivacyPolicy"
            checked={acceptPrivacyPolicy}
            onChange={(e) => setAcceptPrivacyPolicy(e.target.checked)}
            className="mt-0.5 size-4 shrink-0 accent-primary"
          />
          <span>
            I accept the <TextLink to="/privacy-policy">Privacy Policy</TextLink>
          </span>
        </label>

        <div className="flex flex-col gap-4 sm:col-span-2">
          <FormMessage>{formError || error}</FormMessage>
          <Button type="submit" size="xl" disabled={loading}>
            {loading && <Loader2 className="animate-spin" aria-hidden="true" />}
            {loading ? 'Creating account…' : 'Create account'}
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;
