import React, { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Search, Trash2 } from 'lucide-react';

import AppShell, { useShellProfile } from '../components/AppShell';
import { cn } from '@/lib/utils';
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

const api = (path, options = {}) =>
  fetch(`${process.env.REACT_APP_API_SERVER_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      ...options.headers,
    },
  });

const formatDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '–' : date.toLocaleDateString('en-GB');
};

const formatDateTime = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? '–'
    : date.toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
};

const fullName = (user) => [user.first_name, user.last_name].filter(Boolean).join(' ') || '–';

// "shared_via_link" → "Shared via link"
const humanize = (value) => {
  const text = String(value || 'activity').replace(/_/g, ' ');
  return text.charAt(0).toUpperCase() + text.slice(1);
};

// Colunas de cada secção: o que mostrar e por que valor ordenar
const SECTIONS = {
  users: {
    label: 'Users',
    columns: [
      { key: 'name', label: 'Name', value: fullName },
      { key: 'email', label: 'Email', value: (u) => u.email },
      { key: 'country', label: 'Country', value: (u) => u.country || '–' },
      { key: 'created_at', label: 'Registered', value: (u) => u.created_at, render: (u) => formatDate(u.created_at) },
    ],
    search: (u) => [fullName(u), u.email, u.country],
  },
  horses: {
    label: 'Horses',
    columns: [
      { key: 'name', label: 'Name', value: (h) => h.name },
      { key: 'owner', label: 'Owner', value: (h, ctx) => ctx.ownerOf(h) },
      { key: 'age', label: 'Year', value: (h) => h.age ?? '' },
      { key: 'gender', label: 'Gender', value: (h) => h.gender || '–' },
      { key: 'color', label: 'Color', value: (h) => h.color || '–' },
      { key: 'created_at', label: 'Registered', value: (h) => h.created_at, render: (h) => formatDate(h.created_at) },
    ],
    search: (h, ctx) => [h.name, h.breed, h.color, ctx.ownerOf(h)],
  },
};

const compare = (a, b) => {
  if (typeof a === 'string' || typeof b === 'string') {
    return String(a ?? '').localeCompare(String(b ?? ''), undefined, { sensitivity: 'base', numeric: true });
  }
  return (a ?? 0) - (b ?? 0);
};

const StatButton = ({ label, value, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={cn(
      'flex flex-col gap-1.5 rounded-[14px] border bg-card p-3.5 text-left transition-shadow hover:shadow-md md:p-5',
      active && 'border-primary ring-[3px] ring-primary/15'
    )}
  >
    <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">{label}</span>
    <span className="font-serif text-4xl font-bold leading-none lining-nums tabular-nums md:text-5xl">{value ?? '–'}</span>
  </button>
);

// Tabela no computador, lista no telemóvel; cabeçalhos ordenam
const DataTable = ({ section, rows, ctx, sort, onSort, actions }) => {
  const { columns } = SECTIONS[section];
  const [primary, ...rest] = columns;
  const cell = (column, row) => (column.render ? column.render(row, ctx) : column.value(row, ctx));

  return (
    <>
      <div className="overflow-hidden rounded-[14px] border bg-card max-md:hidden">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="border-b bg-secondary/40 text-xs text-muted-foreground">
            <tr>
              {columns.map((column) => (
                <th key={column.key} scope="col" aria-sort={sort.key === column.key ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined} className="px-4 py-2.5 font-semibold">
                  <button type="button" onClick={() => onSort(column.key)} className="flex items-center gap-1 hover:text-foreground">
                    {column.label}
                    {sort.key === column.key &&
                      (sort.dir === 'asc' ? <ArrowUp className="size-3.5" aria-hidden="true" /> : <ArrowDown className="size-3.5" aria-hidden="true" />)}
                  </button>
                </th>
              ))}
              {actions && <th scope="col" className="w-12 px-4 py-2.5"><span className="sr-only">Actions</span></th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ece7dd]">
            {rows.map((row) => (
              <tr key={row.id} data-testid={`${section}-row-${row.id}`}>
                {columns.map((column, i) => (
                  <td key={column.key} className={cn('px-4 py-2.5', i === 0 && 'font-medium')}>{cell(column, row)}</td>
                ))}
                {actions && <td className="px-2 py-1 text-right">{actions(row)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="flex flex-col divide-y divide-[#ece7dd] overflow-hidden rounded-[14px] border bg-card md:hidden">
        {rows.map((row) => (
          <li key={row.id} className="flex items-center gap-3 px-4 py-3">
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate font-medium">{cell(primary, row)}</span>
              <span className="truncate text-xs text-muted-foreground">
                {rest.map((column) => cell(column, row)).filter((v) => v && v !== '–').join(' · ')}
              </span>
            </div>
            {actions && actions(row)}
          </li>
        ))}
      </ul>
    </>
  );
};

const AdminContent = () => {
  const me = useShellProfile();
  const [statistics, setStatistics] = useState(null);
  const [users, setUsers] = useState([]);
  const [horses, setHorses] = useState([]);
  const [logs, setLogs] = useState([]);
  const [section, setSection] = useState('users');
  const [sort, setSort] = useState({ key: 'created_at', dir: 'desc' });
  const [query, setQuery] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.all(
          ['/admin/statistics', '/admin/users', '/admin/horses', '/admin/logs'].map((path) => api(path))
        );

        if (responses.some((res) => res.status === 403)) {
          setError('You do not have access to the control panel.');
          return;
        }
        if (responses.some((res) => !res.ok)) throw new Error('Error loading data.');

        const [stats, usersData, horsesData, logsData] = await Promise.all(responses.map((res) => res.json()));
        setStatistics(stats);
        setUsers(usersData);
        setHorses(horsesData);
        setLogs(logsData);
      } catch (err) {
        console.error(err);
        setError('Error loading dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const ctx = useMemo(() => {
    const names = new Map(users.map((user) => [user.id, fullName(user)]));
    return { ownerOf: (horse) => names.get(horse.user_id) || '–' };
  }, [users]);

  const changeSection = (next) => {
    setSection(next);
    setQuery('');
    setSort({ key: 'created_at', dir: 'desc' });
  };

  const handleSort = (key) =>
    setSort((prev) => ({ key, dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc' }));

  const rows = useMemo(() => {
    if (section === 'logs') return [];
    const config = SECTIONS[section];
    const data = section === 'users' ? users : horses;
    const term = query.trim().toLowerCase();
    const column = config.columns.find((c) => c.key === sort.key) || config.columns[0];
    return data
      .filter((row) => !term || config.search(row, ctx).some((v) => v?.toLowerCase().includes(term)))
      .sort((a, b) => compare(column.value(a, ctx), column.value(b, ctx)) * (sort.dir === 'asc' ? 1 : -1));
  }, [section, users, horses, query, sort, ctx]);

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const response = await api(`/admin/users/${userToDelete.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Error deleting user.');

      setUsers((prev) => prev.filter((user) => user.id !== userToDelete.id));
      setHorses((prev) => prev.filter((horse) => horse.user_id !== userToDelete.id));
      setStatistics((prev) => prev && { ...prev, total_users: prev.total_users - 1 });
      setUserToDelete(null);
    } catch (err) {
      console.error('Error deleting user:', err);
      setDeleteError('The user could not be deleted. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div aria-label="Loading control panel" className="grid animate-pulse grid-cols-3 gap-3 md:gap-5">
        {[0, 1, 2].map((i) => <div key={i} className="h-24 rounded-[14px] bg-secondary md:h-32" />)}
      </div>
    );
  }
  if (error) return <p role="alert" className="rounded-[14px] bg-leather-soft p-4 text-sm">{error}</p>;

  return (
    <>
      <div className="grid grid-cols-3 gap-3 md:gap-5">
        <StatButton label="Users" value={statistics?.total_users} active={section === 'users'} onClick={() => changeSection('users')} />
        <StatButton label="Horses" value={statistics?.total_horses} active={section === 'horses'} onClick={() => changeSection('horses')} />
        <StatButton label="Activity" value={statistics?.total_logs} active={section === 'logs'} onClick={() => changeSection('logs')} />
      </div>

      {section === 'logs' ? (
        <section aria-labelledby="admin-section-title" className="flex flex-col gap-3">
          <h2 id="admin-section-title" className="font-serif text-[28px] font-bold leading-tight">
            Recent activity <span className="font-sans text-sm font-normal text-muted-foreground">· last 50</span>
          </h2>
          <ul className="flex flex-col divide-y divide-[#ece7dd] overflow-hidden rounded-[14px] border bg-card">
            {logs.map((log) => (
              <li key={log.id} className="flex flex-col gap-0.5 px-4 py-3 md:flex-row md:items-center md:justify-between md:gap-4">
                <span className="text-sm">
                  <span className="font-medium">{humanize(log.action)}</span>
                  {log.horse_name && <> · {log.horse_name}</>}
                  {log.recipient && <span className="text-muted-foreground"> · {log.recipient}</span>}
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">{formatDateTime(log.created_at)}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section aria-labelledby="admin-section-title" className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <h2 id="admin-section-title" className="font-serif text-[28px] font-bold leading-tight">
              {SECTIONS[section].label}{' '}
              <span className="font-sans text-sm font-normal text-muted-foreground lining-nums">· {rows.length}</span>
            </h2>
            <div className="relative md:w-80">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search…"
                aria-label={`Search ${SECTIONS[section].label.toLowerCase()}`}
                className="pl-9"
              />
            </div>
          </div>
          <DataTable
            section={section}
            rows={rows}
            ctx={ctx}
            sort={sort}
            onSort={handleSort}
            actions={
              section === 'users'
                ? (user) =>
                    user.id !== me?.id && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        aria-label={`Delete ${fullName(user)}`}
                        onClick={() => {
                          setDeleteError(null);
                          setUserToDelete(user);
                        }}
                      >
                        <Trash2 />
                      </Button>
                    )
                : null
            }
          />
        </section>
      )}

      <Dialog open={!!userToDelete} onOpenChange={(open) => !open && !isDeleting && setUserToDelete(null)}>
        <DialogContent data-testid="admin-delete-user-modal">
          <DialogHeader>
            <DialogTitle>Delete {userToDelete && fullName(userToDelete)}?</DialogTitle>
            <DialogDescription>
              This permanently deletes <strong className="text-foreground">{userToDelete?.email}</strong>, their horses and
              their shares. It cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {deleteError && <p role="alert" className="text-sm font-medium text-destructive">{deleteError}</p>}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setUserToDelete(null)} disabled={isDeleting}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteUser} disabled={isDeleting}>
              {isDeleting ? 'Deleting…' : 'Delete user'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

const AdminDashboard = ({ setIsLoggedIn }) => (
  <AppShell setIsLoggedIn={setIsLoggedIn}>
    <div className="flex flex-col gap-5 md:gap-7">
      <div className="flex flex-col gap-0.5">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-leather">Admin</span>
        <h1 className="font-serif text-[44px] font-bold leading-none md:text-[56px]">Control panel</h1>
      </div>
      {/* Dentro do AppShell, para ler o perfil (não deixar o admin apagar a própria conta) */}
      <AdminContent />
    </div>
  </AppShell>
);

export default AdminDashboard;
