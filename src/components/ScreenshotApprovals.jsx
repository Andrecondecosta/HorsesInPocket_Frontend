import React, { useEffect, useState } from 'react';
import './ScreenshotApprovals.css';

const ScreenshotApprovals = ({ horseId }) => {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
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
      alert(`Error: ${err.message}`);
    }
  };

  if (loading || pending.length === 0) return null;

  return (
    <div className="screenshot-approvals">
      <h3 className="approvals-title">Screenshot Approvals</h3>
      <p className="approvals-description">
        The following users took a screenshot of this horse. Approve to restore their access or revoke to permanently remove it.
      </p>
      <ul className="approvals-list">
        {pending.map((item) => (
          <li key={item.user_horse_id} className="approval-item">
            <span className="approval-user">{item.user_name}</span>
            <div className="approval-actions">
              <button
                className="approve-btn"
                onClick={() => handleAction(item.user_horse_id, 'approve_screenshot')}
              >
                Approve
              </button>
              <button
                className="reject-btn"
                onClick={() => handleAction(item.user_horse_id, 'reject_screenshot')}
              >
                Revoke
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScreenshotApprovals;
