import React from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import AppShell from './AppShell';
import { Button } from '@/components/ui/button';

const LOGO_URL = '/horsehub-wordmark.png';

// Sessão válida (token presente e não expirado). Não apaga nada: a página é pública.
const hasValidSession = () => {
  const token = localStorage.getItem('authToken');
  if (!token) return false;
  try {
    const { exp } = jwtDecode(token);
    return !exp || exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

/**
 * Moldura das páginas públicas (suporte, política de privacidade).
 * Com sessão, usa a moldura da app (cabeçalho e barra de separadores);
 * sem sessão, um cabeçalho simples com o logótipo e "Log in".
 */
const PublicPage = ({ children, setIsLoggedIn }) => {
  if (hasValidSession()) {
    return <AppShell setIsLoggedIn={setIsLoggedIn}>{children}</AppShell>;
  }

  return (
    <div className="hh-ui min-h-dvh bg-background">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 pt-[env(safe-area-inset-top)] backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-8">
          <Link to="/login" aria-label="HorseHub">
            <img src={LOGO_URL} alt="HorseHub" className="h-8 w-auto mix-blend-multiply md:h-9" />
          </Link>
          <Button asChild variant="outline" size="sm">
            <Link to="/login">Log in</Link>
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 pt-6 pb-[max(env(safe-area-inset-bottom),3rem)] md:px-8 md:pt-10">
        {children}
      </main>
    </div>
  );
};

export default PublicPage;
