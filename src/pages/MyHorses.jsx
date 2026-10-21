import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';

import AppShell from '../components/AppShell';
import HorseListItem, { HorseList } from '../components/HorseListItem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Número de catálogo pela ordem de criação ("No. 01" = o primeiro cavalo registado)
const catalogueNumbers = (horses) => {
  const byCreation = [...horses].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  return new Map(byCreation.map((horse, index) => [horse.id, String(index + 1).padStart(2, '0')]));
};

const horseMeta = (horse) => [horse.breed, horse.gender, horse.age].filter(Boolean).join(' · ');

const MyHorses = ({ setIsLoggedIn }) => {
  const [horses, setHorses] = useState([]);
  const [userStatus, setUserStatus] = useState(null);
  const [showLimitPopup, setShowLimitPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [query, setQuery] = useState('');

  const token = localStorage.getItem('authToken');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHorses = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/horses`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Error loading horses');

        const data = await response.json();
        setHorses(data);
      } catch (error) {
        setFetchError('Unable to load horses. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    const fetchUserStatus = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/user_status`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Error loading user status');

        const data = await response.json();
        setUserStatus(data);
      } catch (error) {
        console.error('Error fetching user status:', error);
      }
    };

    if (token) {
      fetchHorses();
      fetchUserStatus();
    }
  }, [token]);

  const numbers = useMemo(() => catalogueNumbers(horses), [horses]);

  // Mais recentes primeiro, filtrados pela pesquisa (nome, raça ou cor)
  const visibleHorses = useMemo(() => {
    const term = query.trim().toLowerCase();
    return [...horses]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .filter((horse) =>
        !term || [horse.name, horse.breed, horse.color].some((value) => value?.toLowerCase().includes(term))
      );
  }, [horses, query]);

  const handleCreateClick = () => {
    if (userStatus && userStatus.used_horses >= userStatus.max_horses) {
      setShowLimitPopup(true);
    } else {
      navigate('/newhorse');
    }
  };

  return (
    <AppShell setIsLoggedIn={setIsLoggedIn}>
      <div className="flex flex-col gap-5 md:gap-7" data-testid="my-horses-container">

        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-leather">
              Private portfolio
            </span>
            <h1 className="font-serif text-[44px] font-bold leading-none md:text-[56px]">My Horses</h1>
            {!loading && !fetchError && (
              <span className="text-[13px] text-muted-foreground md:text-sm">
                {horses.length === 1 ? '1 horse' : `${horses.length} horses`}
              </span>
            )}
          </div>
          <Button
            onClick={handleCreateClick}
            aria-label="Add horse"
            data-testid="create-horse-btn"
            className="size-11 rounded-lg md:h-11 md:w-auto md:px-5"
          >
            <Plus className="size-5" />
            <span className="hidden md:inline">Add horse</span>
          </Button>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <nav aria-label="Portfolio" className="grid h-9 grid-cols-2 rounded-[9px] bg-secondary p-[2px] md:w-72">
            <span
              aria-current="page"
              className="flex items-center justify-center rounded-[7px] bg-card text-[13px] font-semibold shadow-[0_1px_3px_rgba(31,36,32,0.12)]"
            >
              Mine
            </span>
            <Link
              to="/received"
              className="flex items-center justify-center rounded-[7px] text-[13px] font-medium text-foreground/75"
            >
              Received
            </Link>
          </nav>

          <div className="relative md:w-80">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, breed or colour…"
              aria-label="Search horses"
              className="pl-9"
            />
          </div>
        </div>

        {loading ? (
          <ul aria-label="Loading horses" className="grid gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <li key={i} className="flex animate-pulse items-center gap-3.5 rounded-[14px] bg-card p-3 md:flex-col md:items-stretch md:p-0">
                <div className="size-[62px] rounded-[10px] bg-secondary md:aspect-[4/3] md:size-auto md:rounded-b-none" />
                <div className="flex flex-1 flex-col gap-2 md:p-4">
                  <div className="h-4 w-2/3 rounded bg-secondary" />
                  <div className="h-3 w-1/2 rounded bg-secondary" />
                </div>
              </li>
            ))}
          </ul>
        ) : fetchError ? (
          <p role="alert" className="rounded-[14px] bg-leather-soft p-4 text-sm">{fetchError}</p>
        ) : horses.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-[14px] border bg-card px-6 py-12 text-center">
            <h2 className="font-serif text-3xl font-bold">No horses yet</h2>
            <p className="max-w-sm text-sm text-muted-foreground">
              Add your first horse to start your private portfolio.
            </p>
            <Button size="lg" onClick={handleCreateClick}><Plus />Add horse</Button>
          </div>
        ) : visibleHorses.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No horses match “{query}”.</p>
        ) : (
          <HorseList>
            {visibleHorses.map((horse) => {
              const number = `No. ${numbers.get(horse.id)}`;
              return (
                <HorseListItem
                  key={horse.id}
                  testId={`horse-card-${horse.id}`}
                  to={`/horses/${horse.id}`}
                  name={horse.name}
                  photo={horse.images?.[0]}
                  eyebrow={number}
                  eyebrowMobileOnly
                  overlay={number}
                  meta={horseMeta(horse)}
                />
              );
            })}
          </HorseList>
        )}
      </div>

      {/* Limite de cavalos da conta (definido pelo backend). O HorseHub é gratuito:
          sem referências a planos, upgrades ou pagamentos */}
      <Dialog open={showLimitPopup} onOpenChange={setShowLimitPopup}>
        <DialogContent data-testid="horse-limit-popup">
          <DialogHeader>
            <DialogTitle>Horse limit reached</DialogTitle>
            <DialogDescription>
              You have reached the maximum number of horses for your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button data-testid="limit-popup-ok-btn" onClick={() => setShowLimitPopup(false)}>
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
};

export default MyHorses;
