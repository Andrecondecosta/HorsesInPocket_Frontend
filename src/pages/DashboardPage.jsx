import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

import AppShell, { useShellProfile } from '../components/AppShell';
import HistoryTable from '../components/HistoryTable';
import WelcomePopup from '../components/WelcomePopup';
import ScreenshotAlerts from '../components/ScreenshotAlerts';
import { cn } from '@/lib/utils';

const greetingFor = (hour) => {
  if (hour < 12) return 'Good morning';
  if (hour < 19) return 'Good afternoon';
  return 'Good evening';
};

// Precisa de estar dentro do AppShell para ler o perfil já carregado
const Greeting = () => {
  const profile = useShellProfile();
  const name = profile?.first_name;
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-leather">Dashboard</span>
      <h1 className="font-serif text-[40px] font-bold leading-none md:text-[52px]">
        {greetingFor(new Date().getHours())}{name ? `, ${name}` : ''}
      </h1>
      <span className="text-[13px] text-muted-foreground md:text-sm">Here is what is happening in your portfolio.</span>
    </div>
  );
};

const StatTile = ({ label, value, detail, to }) => {
  const content = (
    <>
      <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">{label}</span>
      {/* lining-nums: a Cormorant usa algarismos "antigos" por defeito (o 1 parece um I) */}
      <span className="font-serif text-4xl font-bold leading-none lining-nums tabular-nums md:text-5xl">{value ?? '–'}</span>
      {detail && <span className="text-xs text-muted-foreground max-md:hidden">{detail}</span>}
      {to && <ChevronRight className="absolute top-3.5 right-3 size-4 text-muted-foreground/70" aria-hidden="true" />}
    </>
  );
  const className = 'relative flex flex-col gap-1.5 rounded-[14px] border bg-card p-3.5 md:p-5';
  return to ? (
    <Link to={to} className={cn(className, 'transition-shadow hover:shadow-md')}>{content}</Link>
  ) : (
    <div className={className}>{content}</div>
  );
};

const DashboardPage = ({ setIsLoggedIn }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [userStatus, setUserStatus] = useState(null);
  const [receivedCount, setReceivedCount] = useState(null);
  const [horsesCount, setHorsesCount] = useState(null);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    window.scrollTo(0, 0);

    const hasSeenPopup = localStorage.getItem('hasSeenPopup');

    if (hasSeenPopup === 'newUser') {
      setShowPopup(true);
      localStorage.setItem('hasSeenPopup', 'true');
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

    fetch(`${process.env.REACT_APP_API_SERVER_URL}/user_status`, { method: 'GET', headers })
      .then((response) => {
        if (!response.ok) throw new Error('Error loading user status');
        return response.json();
      })
      .then(setUserStatus)
      .catch((error) => console.error('Error fetching user status:', error));

    // Cavalos no portefólio: o used_horses do plano não serve, o backend repõe-no a zero no plano Basic
    fetch(`${process.env.REACT_APP_API_SERVER_URL}/horses`, { method: 'GET', headers })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => setHorsesCount(Array.isArray(data) ? data.length : null))
      .catch(() => setHorsesCount(null));

    // Cavalos recebidos ativos (os revogados não contam, como na página Received)
    fetch(`${process.env.REACT_APP_API_SERVER_URL}/received`, { method: 'GET', headers })
      .then((response) => (response.ok ? response.json() : []))
      .then((data) => setReceivedCount((data || []).filter((horse) => horse.status !== 'revoked').length))
      .catch(() => setReceivedCount(null));
  }, [token]);

  return (
    <AppShell setIsLoggedIn={setIsLoggedIn}>
      {showPopup && <WelcomePopup onClose={() => setShowPopup(false)} />}

      <div className="flex flex-col gap-6 md:gap-8">
        <Greeting />

        <div className="grid grid-cols-3 gap-2.5 md:gap-5">
          <StatTile label="Horses" value={horsesCount} detail="In your portfolio" to="/myhorses" />
          <StatTile label="Received" value={receivedCount} detail="Shared with you" to="/received" />
          <StatTile label="Shares" value={userStatus?.used_shares} detail="Private links sent" />
        </div>

        <ScreenshotAlerts />
        <HistoryTable />
      </div>
    </AppShell>
  );
};

export default DashboardPage;
