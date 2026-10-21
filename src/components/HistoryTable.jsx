import React, { useEffect, useState } from 'react';
import {
  Camera,
  CheckCircle2,
  Inbox,
  Link2,
  Mail,
  Pencil,
  Plus,
  Trash2,
  UserMinus,
  XCircle,
} from 'lucide-react';

import { cn } from '@/lib/utils';

// Texto e ícone de cada ação registada pelo backend (Log#action)
const ACTIONS = {
  created: { label: 'Added to your portfolio', icon: Plus },
  updated: { label: 'Updated', icon: Pencil },
  deleted: { label: 'Deleted', icon: Trash2, tone: 'danger' },
  shared_via_link: { label: 'Shared via link', icon: Link2, tone: 'primary' },
  shared_via_email: { label: 'Shared via email', icon: Mail, tone: 'primary' },
  received: { label: 'Received', icon: Inbox, tone: 'primary' },
  deleted_share: { label: 'Access removed', icon: UserMinus },
  screenshot_requested: { label: 'Screenshot pending', icon: Camera, tone: 'warning' },
  approved_share: { label: 'Screenshot approved', icon: CheckCircle2, tone: 'primary' },
  revoked_share: { label: 'Screenshot revoked', icon: XCircle, tone: 'danger' },
};

const TONES = {
  primary: 'bg-primary-soft text-primary-soft-foreground',
  warning: 'bg-leather-soft text-leather',
  danger: 'bg-[#f6e3e1] text-destructive',
  neutral: 'bg-secondary text-foreground/70',
};

// O backend envia "AAAA-MM-DD HH:MM"; o Safari (iPhone) não lê esse formato com espaço
const parseLogDate = (value) => new Date(String(value).replace(' ', 'T'));

const isoOf = (value) => {
  const date = parseLogDate(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
};

const formatDate = (value) => {
  const date = parseLogDate(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('pt-PT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const recipientOf = (log) => {
  if (!log.recipient || log.recipient === 'N/A') return null;
  return log.recipient.startsWith('Pending') ? 'Waiting to be opened' : log.recipient;
};

/** Atividade recente do utilizador (GET /logs). */
const HistoryTable = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/logs`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch logs');
        }

        const data = await response.json();
        setLogs(data);
      } catch (err) {
        setError('Unable to load your recent activity.');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <section aria-labelledby="recent-activity-title" className="flex flex-col gap-2">
      <h2 id="recent-activity-title" className="pl-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        Recent activity
      </h2>

      {loading ? (
        <div aria-label="Loading activity" className="flex animate-pulse flex-col gap-3 rounded-[14px] border bg-card p-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="size-8 rounded-full bg-secondary" />
              <div className="h-3 w-1/2 rounded bg-secondary" />
            </div>
          ))}
        </div>
      ) : error ? (
        <p role="alert" className="rounded-[14px] border bg-card p-4 text-sm text-muted-foreground">{error}</p>
      ) : logs.length === 0 ? (
        <p className="rounded-[14px] border bg-card p-4 text-sm text-muted-foreground">No activity yet.</p>
      ) : (
        <ul className="divide-y divide-[#ece7dd] overflow-hidden rounded-[14px] border bg-card">
          {logs.map((log) => {
            const action = ACTIONS[log.action] || { label: 'Activity', icon: Pencil };
            const Icon = action.icon;
            const recipient = recipientOf(log);
            return (
              <li key={log.id} className="flex items-center gap-3 px-4 py-3">
                <span className={cn('flex size-8 shrink-0 items-center justify-center rounded-full', TONES[action.tone || 'neutral'])}>
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span>
                    <span className="font-semibold">{log.horse_name !== 'N/A' ? log.horse_name : 'Horse'}</span>
                    <span className="text-muted-foreground"> · {action.label}</span>
                  </span>
                  {/* No telemóvel a data vem nesta linha, para o texto principal não ser cortado */}
                  <span className="text-[12.5px] text-muted-foreground">
                    {recipient}
                    <span className="md:hidden">
                      {recipient && ' · '}
                      <time dateTime={isoOf(log.created_at)}>{formatDate(log.created_at)}</time>
                    </span>
                  </span>
                </div>
                <time className="shrink-0 text-xs text-muted-foreground max-md:hidden" dateTime={isoOf(log.created_at)}>
                  {formatDate(log.created_at)}
                </time>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

export default HistoryTable;
