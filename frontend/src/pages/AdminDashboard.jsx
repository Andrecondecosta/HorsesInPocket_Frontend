import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [statistics, setStatistics] = useState(null);
  const [users, setUsers] = useState([]);
  const [horses, setHorses] = useState([]);
  const [logs, setLogs] = useState([]);
  const [activeSection, setActiveSection] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" }); // 🔀 Controle de ordenação
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

  const handleDeleteUser = async (userId) => {
  const confirmDelete = window.confirm("Tem certeza que deseja excluir este usuário?");
  if (!confirmDelete) return;

  try {
    const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/admin/users/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao deletar o usuário.");
    }

    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    alert("Usuário excluído com sucesso!");
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
  }
};


  // 🔀 Função de ordenação
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // 🔍 Função para ordenar dados
  const sortedData = (data) => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  // ✅ Renderizar a tabela com ordenação
  const renderSortableHeader = (label, key) => (
    <th onClick={() => handleSort(key)}>
      {label} {sortConfig.key === key && (sortConfig.direction === "asc" ? "▲" : "▼")}
    </th>
  );

  const renderSection = () => {
    switch (activeSection) {
      case "users":
        return (
          <div className="dashboard-section">
            <h2>Utilizadores</h2>
            <table>
              <thead>
                <tr>
                  {renderSortableHeader("Nome", "name")}
                  {renderSortableHeader("Email", "email")}
                  {renderSortableHeader("Data de Registo", "created_at")}
                  {renderSortableHeader("Ações", "actions")}
                </tr>
              </thead>
              <tbody>
                {sortedData(users).map((user) => (
                  <tr key={user.id}>
                    <td>{user.first_name} {user.last_name}</td>
                    <td>{user.email}</td>
                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        ❌
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

        case "horses":
          return (
            <div className="dashboard-section">
              <h2>Cavalos</h2>
              <table>
                <thead>
                  <tr>
                    {renderSortableHeader("Nome", "name")}
                    {renderSortableHeader("Idade", "age")}
                    {renderSortableHeader("Gênero", "gender")}
                    {renderSortableHeader("Cor", "color")}
                    {renderSortableHeader("Data de Registo", "created_at")} {/* ✅ Novo cabeçalho */}
                  </tr>
                </thead>
                <tbody>
                  {sortedData(horses).map((horse) => (
                    <tr key={horse.id}>
                      <td>{horse.name}</td>
                      <td>{horse.age}</td>
                      <td>{horse.gender}</td>
                      <td>{horse.color}</td>
                      <td>{new Date(horse.created_at).toLocaleDateString()}</td> {/* ✅ Exibe a data */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
      case "logs":
        return (
          <div className="dashboard-section">
            <h2>Atividades Recentes</h2>
            <ul>
              {sortedData(logs).map((log, index) => (
                <li key={index}>
                  {log.message} - {new Date(log.created_at).toLocaleString()}
                </li>
              ))}
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="admin-dashboard">
        <h1>Painel de Controlo</h1>

        {statistics && (
          <div className="dashboard-summary">
            <div className="card" onClick={() => setActiveSection("horses")}>
              <h3>Total de Cavalos</h3>
              <p>{statistics.total_horses}</p>
            </div>
            <div className="card" onClick={() => setActiveSection("users")}>
              <h3>Total de Utilizadores</h3>
              <p>{statistics.total_users}</p>
            </div>
            <div className="card" onClick={() => setActiveSection("logs")}>
              <h3>Total de Logs</h3>
              <p>{statistics.total_logs}</p>
            </div>
          </div>
        )}
        {/* ✅ Detalhes da secção selecionada */}
        {renderSection()}
      </div>
    </Layout>
  );
};

export default AdminDashboard;
