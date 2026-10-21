import React, { useEffect, useState } from 'react';
import { ShieldAlert } from 'lucide-react';

import { Button } from '@/components/ui/button';

const ScreenshotApprovals = ({ horseId }) => {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState(null);
  const token = localStorage.getItem('authToken');
  const API_URL = process.env.REACT_APP_API_SERVER_URL;

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await fetch(`${API_URL}/horses/${horseId}/pending_approvals`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch pending approvals');
        const data = await res.json();
        setPending(data.pending_approvals || []);
      } catch (err) {
        console.error('Error fetching pending approvals:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPending();
  }, [horseId, API_URL, token]);

  const handleAction = async (userHorseId, action) => {
    setActionError(null);
    try {
      const res = await fetch(`${API_URL}/user_horses/${userHorseId}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`Failed to ${action}`);
      setPending((prev) => prev.filter((item) => item.user_horse_id !== userHorseId));
    } catch (err) {
      console.error(`Error during ${action}:`, err);
      setActionError('Something went wrong. Please try again.');
    }
  };

  if (loading || pending.length === 0) return null;

  return (
    <section aria-labelledby="screenshot-approvals-title" className="flex flex-col gap-3 rounded-[14px] bg-leather-soft p-4">
      <div className="flex items-start gap-3">
        <ShieldAlert className="mt-0.5 size-5 shrink-0 text-leather" aria-hidden="true" />
        <div className="flex flex-col gap-0.5">
          <h2 id="screenshot-approvals-title" className="font-semibold">Screenshot detected</h2>
          <p className="text-[13px] text-foreground/80">
            These people took a screenshot of this horse. Their access is paused until you decide.
          </p>
        </div>
      </div>

      <ul className="flex flex-col gap-2 pl-8">
        {pending.map((item) => (
          <li key={item.user_horse_id} className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-medium">{item.user_name}</span>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => handleAction(item.user_horse_id, 'approve_screenshot')}>
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-destructive"
                onClick={() => handleAction(item.user_horse_id, 'reject_screenshot')}
              >
                Revoke access
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {actionError && <p role="alert" className="pl-8 text-sm font-medium text-destructive">{actionError}</p>}
    </section>
  );
};

export default ScreenshotApprovals;
