import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import AuthLayout, { FormMessage } from '../components/AuthLayout';
import { Button } from '@/components/ui/button';

// Página de chegada de um link de partilha, antes do login/registo
const WelcomePage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');

  // Os parâmetros vêm codificados do SharedHorse
  const rawHorseImage = searchParams.get('horseImage') || '';
  const horseImage = rawHorseImage ? decodeURIComponent(rawHorseImage) : '';

  const rawHorseName = searchParams.get('horseName') || 'Your Horse';
  const horseName = decodeURIComponent(rawHorseName);

  const errorMessage = searchParams.get('message');

  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    if (errorMessage) {
      setAlertMessage(decodeURIComponent(errorMessage));
    }
  }, [errorMessage]);

  // O token segue para o login/registo, para o cavalo ficar associado à conta
  const withToken = (path) => (token ? `${path}?token=${encodeURIComponent(token)}` : path);

  return (
    <AuthLayout
      eyebrow="Shared with you"
      title="A horse is waiting for you"
      description="Someone shared a horse with you on HorseHub, a private portfolio for horse owners."
    >
      <FormMessage>{alertMessage}</FormMessage>

      <figure className="overflow-hidden rounded-[14px] border bg-card">
        <div className="flex aspect-[4/3] items-center justify-center bg-[#e3ded3] md:aspect-[16/9]">
          {horseImage && horseImage.startsWith('http') ? (
            <img src={horseImage} alt={horseName} className="size-full object-cover" />
          ) : (
            <span aria-hidden="true" className="font-serif text-7xl font-bold text-[#5c5f58]">
              {horseName.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <figcaption className="flex flex-col p-4">
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">Shared horse</span>
          <span className="font-serif text-[28px] font-bold leading-tight">{horseName}</span>
        </figcaption>
      </figure>

      <div className="flex flex-col gap-2.5">
        <Button asChild size="xl">
          <Link to={withToken('/login')}>Log in to view</Link>
        </Button>
        <Button asChild size="xl" variant="outline">
          <Link to={withToken('/register')}>Create a free account</Link>
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Already on HorseHub? Log in. First time here? Create your account.
        </p>
      </div>
    </AuthLayout>
  );
};

export default WelcomePage;
