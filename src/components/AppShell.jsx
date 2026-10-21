import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { CircleUser, House, Inbox, LayoutGrid, LifeBuoy, LogOut, User } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Logótipo recortado do ícone da app (fundo branco: mix-blend-multiply funde-o com o marfim)
const LOGO_URL = '/horsehub-wordmark.png';

// Separadores da barra inferior (só no telemóvel)
const TABS = [
  { to: '/dashboard', label: 'Home', icon: House },
  { to: '/myhorses', label: 'Horses', icon: LayoutGrid },
  { to: '/received', label: 'Received', icon: Inbox },
  { to: '/profile', label: 'Profile', icon: CircleUser },
];

const initialsOf = (firstName, lastName) =>
  `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || '·';

/**
 * Moldura dos ecrãs do novo design (substitui o Layout antigo, ecrã a ecrã).
 * - Cabeçalho com logótipo e menu da conta, em todos os tamanhos.
 * - Barra de separadores em baixo, só no telemóvel (< md).
 */
const AppShell = ({ setIsLoggedIn = () => {}, children }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    fetch(`${process.env.REACT_APP_API_SERVER_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => data && setProfile(data))
      .catch(() => {});
  }, []);

  // Avisa o resto da app (ex.: aviso de instalação) de que há uma barra fixa no fundo
  useEffect(() => {
    document.body.classList.add('hh-has-tabbar');
    return () => document.body.classList.remove('hh-has-tabbar');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const firstName = profile?.first_name || 'there';

  return (
    <div className="hh-ui min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 pt-[env(safe-area-inset-top)] backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-8">
          <Link to="/dashboard" aria-label="HorseHub — Dashboard">
            <img src={LOGO_URL} alt="HorseHub" className="h-8 w-auto mix-blend-multiply md:h-9" />
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Account menu"
                className="flex items-center gap-2.5 rounded-full py-1 pl-3 pr-1 hover:bg-accent"
              >
                <span className="hidden text-sm font-medium md:inline">Hello, {firstName}</span>
                <span className="flex size-9 items-center justify-center rounded-full bg-secondary text-[13px] font-semibold">
                  {initialsOf(profile?.first_name, profile?.last_name)}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Hello, {firstName}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile"><User />Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/support"><LifeBuoy />Support</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onSelect={handleLogout}>
                <LogOut />Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pt-6 pb-28 md:px-8 md:pt-10 md:pb-16">{children}</main>

      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
      >
        <div className="grid h-16 grid-cols-4">
          {TABS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center gap-1 text-[10.5px] font-medium text-muted-foreground',
                  isActive && 'font-semibold text-primary'
                )
              }
            >
              <Icon className="size-6" strokeWidth={1.8} aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default AppShell;
