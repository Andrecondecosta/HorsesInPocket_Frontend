import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [statistics, setStatistics] = useState(null);
  const [users, setUsers] = useState([]);
  const [horses, setHorses] = useState([]);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");

        const [statsRes, usersRes, horsesRes, logsRes] = await Promise.all([
          fetch(`${process.env.REACT_APP_API_SERVER_URL}/admin/statistics`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.REACT_APP_API_SERVER_URL}/admin/users`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.REACT_APP_API_SERVER_URL}/admin/horses`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.REACT_APP_API_SERVER_URL}/admin/logs`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!statsRes.ok || !usersRes.ok || !horsesRes.ok || !logsRes.ok) {
          throw new Error("Erro ao carregar dados.");
        }

        setStatistics(await statsRes.json());
        setUsers(await usersRes.json());
        setHorses(await horsesRes.json());
        setLogs(await logsRes.json());
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar dados do painel de controlo.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="admin-dashboard">
          <h1>Painel de Controlo</h1>
          <p>A carregar dados...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="admin-dashboard">
          <h1>Painel de Controlo</h1>
          <p className="error">{error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="admin-dashboard">
        <h1>Painel de Controlo</h1>
        {statistics && (
          <div className="dashboard-summary">
            <h2>Resumo</h2>
            <p>Total de Cavalos: {statistics.total_horses}</p>
            <p>Total de Utilizadores: {statistics.total_users}</p>
            <p>Total de Logs: {statistics.total_logs}</p>
          </div>
        )}
        <div className="dashboard-users">
          <h2>Utilizadores</h2>
          {users.length ? (
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Data de Registo</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Nenhum utilizador encontrado.</p>
          )}
        </div>
        <div className="dashboard-horses">
          <h2>Cavalos</h2>
          {horses.length ? (
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Idade</th>
                  <th>Gênero</th>
                  <th>Cor</th>
                </tr>
              </thead>
              <tbody>
                {horses.map((horse) => (
                  <tr key={horse.id}>
                    <td>{horse.name}</td>
                    <td>{horse.age}</td>
                    <td>{horse.gender}</td>
                    <td>{horse.color}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Nenhum cavalo encontrado.</p>
          )}
        </div>
        <div className="dashboard-logs">
          <h2>Atividades Recentes</h2>
          {logs.length ? (
            <ul>
              {logs.map((log, index) => (
                <li key={index}>
                  {log.message} - {new Date(log.created_at).toLocaleString()}
                </li>
              ))}
            </ul>
          ) : (
            <p>Nenhuma atividade recente encontrada.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
