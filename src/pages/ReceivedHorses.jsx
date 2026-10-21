import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Camera, Search, X } from 'lucide-react';

import AppShell from '../components/AppShell';
import HorseListItem, { HorseList } from '../components/HorseListItem';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

// O backend responde "Desconhecido" quando não sabe quem partilhou
const senderOf = (horse) =>
  horse.sender_name && horse.sender_name !== 'Desconhecido' ? `From ${horse.sender_name}` : 'Unknown sender';

const horseMeta = (horse) => [horse.breed, horse.gender, horse.age].filter(Boolean).join(' · ');

const ReceivedHorses = ({ setIsLoggedIn }) => {
  const [horses, setHorses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const token = localStorage.getItem('authToken');
  const navigate = useNavigate();
  const location = useLocation();
  const [alertType, setAlertType] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  // Mensagem vinda do link de partilha (ex.: link já usado): fica 15 s ou até ser fechada
  const clearAlert = () => {
    setAlertMessage('');
    setAlertType('');
    navigate('/received', { replace: true, state: {} });
  };

  useEffect(() => {
    if (!location.state?.message) return undefined;
    setAlertMessage(location.state.message);
    setAlertType(location.state.type || 'info');
    const timer = setTimeout(clearAlert, 15000);
    return () => clearTimeout(timer);
  }, [location.state]);

  const fetchReceivedHorses = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/received`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch received horses');

      const data = await response.json();
      setHorses(data || []);
    } catch (error) {
      setError('Unable to load received horses. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchReceivedHorses();
    } else {
      setError('Token not found');
      setIsLoading(false);
    }
  }, [token]);

  // Depois de um screenshot, a proteção traz o utilizador para aqui com refresh: true
  useEffect(() => {
    if (!location.state?.refresh) return;
    fetchReceivedHorses();

    // Espera 1 tick para garantir que a navegação terminou antes de limpar o estado
    setTimeout(() => {
      navigate('/received', { replace: true, state: {} });
    }, 0);
  }, [location.state]);

  // Os acessos revogados não aparecem; mais recentes primeiro; filtrados pela pesquisa
  const visibleHorses = useMemo(() => {
    const term = query.trim().toLowerCase();
    return horses
      .filter((horse) => horse.status !== 'revoked')
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .filter(
        (horse) =>
          !term ||
          [horse.name, horse.breed, horse.color, horse.sender_name].some((value) => value?.toLowerCase().includes(term))
      );
  }, [horses, query]);

  const activeCount = horses.filter((horse) => horse.status !== 'revoked').length;

  return (
    <AppShell setIsLoggedIn={setIsLoggedIn}>
      <div className="flex flex-col gap-5 md:gap-7" data-testid="received-horses-container">

        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-leather">Shared with you</span>
          <h1 className="font-serif text-[44px] font-bold leading-none md:text-[56px]">Received Horses</h1>
          {!isLoading && !error && (
            <span className="text-[13px] text-muted-foreground md:text-sm">
              {activeCount === 1 ? '1 horse' : `${activeCount} horses`} · read-only access
            </span>
          )}
        </div>

        {alertMessage && (
          <div
            role="alert"
            className={cn(
              'flex items-start justify-between gap-3 rounded-[14px] p-4 text-sm font-medium',
              alertType === 'error' ? 'bg-[#f6e3e1] text-destructive' : 'bg-primary-soft text-primary-soft-foreground'
            )}
          >
            <span>{alertMessage}</span>
            <button type="button" onClick={clearAlert} aria-label="Dismiss message" className="shrink-0 opacity-70 hover:opacity-100">
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        )}

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <nav aria-label="Portfolio" className="grid h-9 grid-cols-2 rounded-[9px] bg-secondary p-[2px] md:w-72">
            <Link
              to="/myhorses"
              className="flex items-center justify-center rounded-[7px] text-[13px] font-medium text-foreground/75"
            >
              Mine
            </Link>
            <span
              aria-current="page"
              className="flex items-center justify-center rounded-[7px] bg-card text-[13px] font-semibold shadow-[0_1px_3px_rgba(31,36,32,0.12)]"
            >
              Received
            </span>
          </nav>

          <div className="relative md:w-80">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, breed or sender…"
              aria-label="Search received horses"
              className="pl-9"
            />
          </div>
        </div>

        {isLoading ? (
          <ul aria-label="Loading horses" className="grid gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
            {[0, 1, 2].map((i) => (
              <li key={i} className="flex animate-pulse items-center gap-3.5 rounded-[14px] bg-card p-3 md:flex-col md:items-stretch md:p-0">
                <div className="size-[62px] rounded-[10px] bg-secondary md:aspect-[4/3] md:size-auto md:rounded-b-none" />
                <div className="flex flex-1 flex-col gap-2 md:p-4">
                  <div className="h-4 w-2/3 rounded bg-secondary" />
                  <div className="h-3 w-1/2 rounded bg-secondary" />
                </div>
              </li>
            ))}
          </ul>
        ) : error ? (
          <p role="alert" className="rounded-[14px] bg-leather-soft p-4 text-sm">{error}</p>
        ) : activeCount === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-[14px] border bg-card px-6 py-12 text-center">
            <h2 className="font-serif text-3xl font-bold">No received horses yet</h2>
            <p className="max-w-sm text-sm text-muted-foreground">
              When someone shares a horse with you through a private link, it appears here.
            </p>
          </div>
        ) : visibleHorses.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No horses match “{query}”.</p>
        ) : (
          <HorseList>
            {visibleHorses.map((horse) => {
              const paused = horse.status === 'pending_approval';
              return (
                <HorseListItem
                  key={horse.id}
                  testId={`received-card-${horse.id}`}
                  // Acesso em pausa (screenshot à espera do dono): o cavalo não abre
                  to={paused ? undefined : `/horses/${horse.id}?readonly=true`}
                  name={horse.name}
                  photo={horse.images?.[0]}
                  dimmed={paused}
                  eyebrow={senderOf(horse)}
                  meta={horseMeta(horse)}
                  notice={
                    paused && (
                      <span className="mt-1.5 flex items-center gap-1.5 text-[12px] font-medium text-leather">
                        <Camera className="size-3.5 shrink-0" aria-hidden="true" />
                        Screenshot detected · waiting for the owner
                      </span>
                    )
                  }
                />
              );
            })}
          </HorseList>
        )}
      </div>
    </AppShell>
  );
};

export default ReceivedHorses;
