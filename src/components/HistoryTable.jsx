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
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
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
      case 'received':
        return 'status-received';
      case 'pending':
        return 'status-pending';
      case 'shared':
        return 'status-shared';
      case 'deleted':
        return 'status-deleted';
      default:
        return 'status-default';
    }
  };

  return (
    <div className="history-table">
      <h2 className="history-titles">Histórico</h2>
      <div className="history-table-container">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Recetor Do Cavalo</th>
              <th>Estado</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{log.horse_name || 'N/A'}</td>
                <td>{log.recipient || 'N/A'}</td>
                <td>
                  <span className={`status-tag ${getStatusClass(log.action)}`}>
                    {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
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
