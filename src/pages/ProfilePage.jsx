import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, LifeBuoy, LogOut, Pencil, ShieldCheck, Trash2 } from 'lucide-react';

import AppShell from '../components/AppShell';
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

const initialsOf = (user) =>
  `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase() || '·';

const capitalize = (value) => (value ? value.charAt(0).toUpperCase() + value.slice(1) : null);

// "1990-01-01" → "01/01/1990" (sem passar por Date, para não mudar o dia com o fuso horário)
const formatBirthdate = (value) => (value ? value.split('-').reverse().join('/') : null);

const memberSince = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? null
    : date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
};

const DetailRow = ({ label, value }) => (
  <div className="flex items-center justify-between gap-4 px-4 py-3">
    <dt className="text-muted-foreground">{label}</dt>
    <dd className="truncate text-right font-medium">{value || 'Not specified'}</dd>
  </div>
);

// Linha de navegação estilo iOS (ícone, texto, seta)
const ActionRow = ({ to, onClick, icon: Icon, children, destructive = false }) => {
  const className = `flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-accent/60 ${destructive ? 'text-destructive' : ''}`;
  const content = (
    <>
      <Icon className="size-[18px] shrink-0" aria-hidden="true" />
      <span className="flex-1 font-medium">{children}</span>
      {to && <ChevronRight className="size-4 text-muted-foreground/70" aria-hidden="true" />}
    </>
  );
  return to ? (
    <Link to={to} className={className}>{content}</Link>
  ) : (
    <button type="button" onClick={onClick} className={className}>{content}</button>
  );
};

const ProfilePage = ({ setIsLoggedIn = () => {} }) => {
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleteError, setDeleteError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const token = localStorage.getItem('authToken');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Error loading profile');

        const data = await response.json();
        setUser(data);
      } catch (error) {
        setError('Unable to load your profile. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const closeDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    setDeleteConfirmText('');
    setDeleteError(null);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') return;

    setIsDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/delete_account`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        localStorage.removeItem('authToken');
        setIsLoggedIn(false);
        navigate('/login');
      } else {
        const data = await res.json();
        setDeleteError(data.error || 'Error deleting account. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      setDeleteError('Error deleting account. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ');
  const since = memberSince(user.created_at);

  return (
    <AppShell setIsLoggedIn={setIsLoggedIn}>
      <div className="mx-auto flex max-w-2xl flex-col gap-6 md:gap-8">
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-leather">Account</span>
          <h1 className="font-serif text-[44px] font-bold leading-none md:text-[56px]">Profile</h1>
        </div>

        {isLoading ? (
          <div aria-label="Loading profile" className="flex animate-pulse items-center gap-4 rounded-[14px] border bg-card p-4">
            <div className="size-16 rounded-full bg-secondary" />
            <div className="flex flex-1 flex-col gap-2">
              <div className="h-5 w-1/2 rounded bg-secondary" />
              <div className="h-3 w-1/3 rounded bg-secondary" />
            </div>
          </div>
        ) : error ? (
          <p role="alert" className="rounded-[14px] bg-leather-soft p-4 text-sm">{error}</p>
        ) : (
          <>
            <section className="flex items-center gap-4 rounded-[14px] border bg-card p-4">
              <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-secondary font-serif text-2xl font-bold">
                {initialsOf(user)}
              </span>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate font-serif text-[28px] font-bold leading-tight">{fullName}</span>
                <span className="truncate text-sm text-muted-foreground">{user.email}</span>
                {since && <span className="text-xs text-muted-foreground">Member since {since}</span>}
              </div>
              <Button asChild variant="outline" size="sm" className="max-sm:hidden">
                <Link to="/update-profile" data-testid="profile-edit-button"><Pencil />Edit</Link>
              </Button>
            </section>

            <section aria-labelledby="details-title" className="flex flex-col gap-1.5">
              <h2 id="details-title" className="pl-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Personal details
              </h2>
              <dl className="divide-y divide-[#ece7dd] overflow-hidden rounded-[14px] border bg-card">
                <DetailRow label="Date of birth" value={formatBirthdate(user.birthdate)} />
                <DetailRow label="Gender" value={capitalize(user.gender)} />
                <DetailRow label="Phone" value={user.phone_number} />
                <DetailRow label="Country" value={user.country} />
              </dl>
            </section>

            <nav aria-label="Account" className="flex flex-col divide-y divide-[#ece7dd] overflow-hidden rounded-[14px] border bg-card">
              <ActionRow to="/update-profile" icon={Pencil}>Edit profile</ActionRow>
              <ActionRow to="/support" icon={LifeBuoy}>Support</ActionRow>
              <ActionRow to="/privacy-policy" icon={ShieldCheck}>Privacy policy</ActionRow>
              <ActionRow onClick={handleLogout} icon={LogOut}>Logout</ActionRow>
            </nav>

            <section aria-labelledby="danger-title" className="flex flex-col gap-1.5" data-testid="delete-account-section">
              <h2 id="danger-title" className="pl-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Danger zone
              </h2>
              <div className="flex flex-col gap-3 rounded-[14px] border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account, horses, photos and shares.
                </p>
                <Button
                  variant="outline"
                  className="shrink-0 text-destructive"
                  data-testid="delete-account-btn"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 />
                  Delete account
                </Button>
              </div>
            </section>
          </>
        )}
      </div>

      <Dialog open={showDeleteConfirm} onOpenChange={(open) => !open && closeDeleteConfirm()}>
        <DialogContent data-testid="delete-account-modal">
          <DialogHeader>
            <DialogTitle>Delete your account?</DialogTitle>
            <DialogDescription>
              This is <strong className="text-foreground">permanent and irreversible</strong>. All your data, horses,
              images and shares will be deleted.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <label htmlFor="delete-confirm" className="text-sm">
              Type <strong>DELETE</strong> to confirm:
            </label>
            <Input
              id="delete-confirm"
              data-testid="delete-confirm-input"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="DELETE"
              autoComplete="off"
            />
            {deleteError && <p role="alert" className="text-sm font-medium text-destructive">{deleteError}</p>}
          </div>
          <DialogFooter>
            <Button variant="ghost" data-testid="delete-confirm-cancel" onClick={closeDeleteConfirm}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              data-testid="delete-confirm-yes"
              disabled={deleteConfirmText !== 'DELETE' || isDeleting}
              onClick={handleDeleteAccount}
            >
              {isDeleting ? 'Deleting…' : 'Delete my account'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
};

export default ProfilePage;
