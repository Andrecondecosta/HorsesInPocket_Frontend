import React, { useEffect, useState } from 'react';
import './HistoryTable.css';

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
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const getStatusClass = (action) => {
    switch (action) {
      case 'created':
        return 'status-created';
      case 'updated':
        return 'status-updated';
      case 'deleted':
        return 'status-deleted';
      case 'shared_via_link':
        return 'status-shared-link';
      case 'shared_via_email':
        return 'status-shared-email';
      case 'received':
        return 'status-received';
      case 'deleted_share':
        return 'status-deleted-share';
      default:
        return 'status-default';
    }
  };

  const formatActionText = (action) => {
    switch (action) {
      case 'created':
        return 'Created';
      case 'updated':
        return 'Updated';
      case 'deleted':
        return 'Deleted';
      case 'shared_via_link':
        return 'Shared via Link';
      case 'shared_via_email':
        return 'Shared via Email';
      case 'received':
        return 'Received';
      case 'deleted_share':
        return 'Deleted Share';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="history-table">
      <h2 className="history-titles">History</h2>
      <div className="history-table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>User</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{log.horse_name || 'N/A'}</td>
                <td>{log.recipient || 'N/A'}</td>
                <td>
                  <span className={`status-tag ${getStatusClass(log.action)}`}>
                    {formatActionText(log.action)}
                  </span>
                </td>
                <td>{log.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryTable;
