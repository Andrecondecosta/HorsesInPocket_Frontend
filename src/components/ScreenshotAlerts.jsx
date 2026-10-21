import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Camera } from 'lucide-react';

import { Button } from '@/components/ui/button';

const ScreenshotAlerts = () => {
  const [alertGroups, setAlertGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState(null);
  const token = localStorage.getItem('authToken');
  const API_URL = process.env.REACT_APP_API_SERVER_URL;

  const fetchAlerts = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/screenshot_alerts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Error loading alerts');
      const data = await res.json();
      setAlertGroups(data.screenshot_alerts || []);
    } catch (err) {
      console.error('Error fetching screenshot alerts:', err);
    } finally {
      setLoading(false);
    }
  }, [API_URL, token]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const handleAction = async (userHorseId, action, horseId) => {
    setActionError(null);
    try {
      const res = await fetch(`${API_URL}/user_horses/${userHorseId}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`Error performing action: ${action}`);

      setAlertGroups((prev) =>
        prev
          .map((group) =>
            group.horse_id === horseId
              ? { ...group, alerts: group.alerts.filter((a) => a.user_horse_id !== userHorseId) }
              : group
          )
          .filter((group) => group.alerts.length > 0)
      );
    } catch (err) {
      console.error(`Error during ${action}:`, err);
      setActionError('Something went wrong. Please try again.');
    }
  };

  if (loading || alertGroups.length === 0) return null;

  const total = alertGroups.reduce((sum, g) => sum + g.alerts.length, 0);

  return (
    <section
      aria-labelledby="screenshot-alerts-title"
      className="overflow-hidden rounded-[14px] bg-leather-soft"
      data-testid="screenshot-alerts-section"
    >
      <div className="flex items-center justify-between gap-3 px-4 pt-4 pb-2">
        <h2 id="screenshot-alerts-title" className="font-semibold">Screenshot alerts</h2>
        <span className="rounded-full bg-card px-2.5 py-0.5 text-xs font-semibold text-leather">
          {total} pending
        </span>
      </div>

      <ul className="flex flex-col">
        {alertGroups.map((group) =>
          group.alerts.map((alert) => (
            <li
              key={alert.user_horse_id}
              className="flex flex-col gap-3 border-t border-[#e3d6c4] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              data-testid={`sa-horse-group-${group.horse_id}`}
            >
              <div className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-card text-leather">
                  <Camera className="size-[18px]" aria-hidden="true" />
                </span>
                <div className="flex min-w-0 flex-col">
                  <Link to={`/horses/${group.horse_id}`} className="font-serif text-xl font-bold leading-tight hover:underline">
                    {group.horse_name}
                  </Link>
                  <span className="text-[13px] text-foreground/75">
                    {alert.user_name ? `${alert.user_name} took a screenshot` : 'Someone took a screenshot'} · access paused
                  </span>
                </div>
              </div>
              <div className="flex gap-2 pl-12 sm:pl-0">
                <Button
                  size="sm"
                  data-testid={`sa-approve-btn-${alert.user_horse_id}`}
                  onClick={() => handleAction(alert.user_horse_id, 'approve_screenshot', group.horse_id)}
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive"
                  data-testid={`sa-revoke-btn-${alert.user_horse_id}`}
                  onClick={() => handleAction(alert.user_horse_id, 'reject_screenshot', group.horse_id)}
                >
                  Revoke
                </Button>
              </div>
            </li>
          ))
        )}
      </ul>

      {actionError && <p role="alert" className="px-4 pb-3 text-sm font-medium text-destructive">{actionError}</p>}
    </section>
  );
};

export default ScreenshotAlerts;
