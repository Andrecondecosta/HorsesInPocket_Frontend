import React, { useEffect, useState, useCallback } from 'react';
import './ScreenshotAlerts.css';

const ScreenshotAlerts = () => {
  const [alertGroups, setAlertGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('authToken');
  const API_URL = process.env.REACT_APP_API_SERVER_URL;

  const fetchAlerts = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/screenshot_alerts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load alerts');
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
    try {
      const res = await fetch(`${API_URL}/user_horses/${userHorseId}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`Failed to ${action}`);

      setAlertGroups((prev) =>
        prev
          .map((group) =>
            group.horse_id === horseId
              ? {
                  ...group,
                  alerts: group.alerts.filter((a) => a.user_horse_id !== userHorseId),
                }
              : group
          )
          .filter((group) => group.alerts.length > 0)
      );
    } catch (err) {
      console.error(`Error during ${action}:`, err);
    }
  };

  if (loading || alertGroups.length === 0) return null;

  return (
    <div className="screenshot-alerts-section" data-testid="screenshot-alerts-section">
      <div className="sa-header">
        <span className="sa-section-title">Screenshot Alerts</span>
        <span className="sa-total-badge">
          {alertGroups.reduce((sum, g) => sum + g.alerts.length, 0)} pending
        </span>
      </div>

      {alertGroups.map((group) =>
        group.alerts.map((alert, index) => (
          <div key={alert.user_horse_id} className="sa-row" data-testid={`sa-horse-group-${group.horse_id}`}>
            <span className="sa-horse-name">{group.horse_name}</span>
            <span className="sa-req-label">Request #{index + 1}</span>
            <div className="sa-actions">
              <button
                data-testid={`sa-approve-btn-${alert.user_horse_id}`}
                className="sa-approve-btn"
                onClick={() => handleAction(alert.user_horse_id, 'approve_screenshot', group.horse_id)}
              >
                Approve
              </button>
              <button
                data-testid={`sa-revoke-btn-${alert.user_horse_id}`}
                className="sa-revoke-btn"
                onClick={() => handleAction(alert.user_horse_id, 'reject_screenshot', group.horse_id)}
              >
                Revoke
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ScreenshotAlerts;
