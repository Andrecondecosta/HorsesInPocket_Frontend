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
      if (!res.ok) throw new Error('Erro ao carregar alertas');
      const data = await res.json();
      setAlertGroups(data.screenshot_alerts || []);
    } catch (err) {
      console.error('Erro ao buscar alertas de screenshots:', err);
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
      if (!res.ok) throw new Error(`Erro ao executar ação: ${action}`);

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
      console.error(`Erro durante ${action}:`, err);
    }
  };

  if (loading || alertGroups.length === 0) return null;

  return (
    <div className="screenshot-alerts-section" data-testid="screenshot-alerts-section">
      <h3 className="sa-section-title">Alertas de Screenshots</h3>
      <p className="sa-section-description">
        Cavalos com acesso pendente devido a screenshots. Aprove ou revogue o acesso anonimamente.
      </p>

      <div className="sa-groups">
        {alertGroups.map((group) => (
          <div key={group.horse_id} className="sa-horse-group" data-testid={`sa-horse-group-${group.horse_id}`}>
            <div className="sa-horse-header">
              <span className="sa-horse-name">{group.horse_name}</span>
              <span className="sa-badge">{group.alerts.length} pendente{group.alerts.length !== 1 ? 's' : ''}</span>
            </div>

            <ul className="sa-alert-list">
              {group.alerts.map((alert, index) => (
                <li key={alert.user_horse_id} className="sa-alert-item">
                  <span className="sa-alert-label">Pedido #{index + 1}</span>
                  <div className="sa-alert-actions">
                    <button
                      data-testid={`sa-approve-btn-${alert.user_horse_id}`}
                      className="sa-approve-btn"
                      onClick={() => handleAction(alert.user_horse_id, 'approve_screenshot', group.horse_id)}
                    >
                      Aprovar
                    </button>
                    <button
                      data-testid={`sa-revoke-btn-${alert.user_horse_id}`}
                      className="sa-revoke-btn"
                      onClick={() => handleAction(alert.user_horse_id, 'reject_screenshot', group.horse_id)}
                    >
                      Revogar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScreenshotAlerts;
