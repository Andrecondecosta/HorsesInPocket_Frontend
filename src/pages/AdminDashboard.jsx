import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import LoadingPopup from "../components/LoadingPopup";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [statistics, setStatistics] = useState(null);
  const [users, setUsers] = useState([]);
  const [horses, setHorses] = useState([]);
  const [logs, setLogs] = useState([]);
  const [activeSection, setActiveSection] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
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
          throw new Error("Error loading data.");
        }

        setStatistics(await statsRes.json());
        setUsers(await usersRes.json());
        setHorses(await horsesRes.json());
        setLogs(await logsRes.json());
      } catch (err) {
        console.error(err);
        setError("Error loading dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteUser = async (userId) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this user?");
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
      throw new Error("Error deleting user.");
    }

    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    alert("User deleted successfully!");
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

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
            <h2>Users</h2>
            <table>
              <thead>
                <tr>
                  {renderSortableHeader("Name", "name")}
                  {renderSortableHeader("Email", "email")}
                  {renderSortableHeader("Registration Date", "created_at")}
                  {renderSortableHeader("Actions", "actions")}
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
              <h2>Horses</h2>
              <table>
                <thead>
                  <tr>
                    {renderSortableHeader("Name", "name")}
                    {renderSortableHeader("Age", "age")}
                    {renderSortableHeader("Gender", "gender")}
                    {renderSortableHeader("Color", "color")}
                    {renderSortableHeader("Registration Date", "created_at")}
                  </tr>
                </thead>
                <tbody>
                  {sortedData(horses).map((horse) => (
                    <tr key={horse.id}>
                      <td>{horse.name}</td>
                      <td>{horse.age}</td>
                      <td>{horse.gender}</td>
                      <td>{horse.color}</td>
                      <td>{new Date(horse.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
      case "logs":
        return (
          <div className="dashboard-section">
            <h2>Recent Activity</h2>
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

  if (loading) return <LoadingPopup message="Loading..." />;

  return (
    <Layout>
      <div className="admin-dashboard">
        <h1>Control Panel</h1>

        {statistics && (
          <div className="dashboard-summary">
            <div className="card" onClick={() => setActiveSection("horses")}>
              <h3>Total Horses</h3>
              <p>{statistics.total_horses}</p>
            </div>
            <div className="card" onClick={() => setActiveSection("users")}>
              <h3>Total Users</h3>
              <p>{statistics.total_users}</p>
            </div>
            <div className="card" onClick={() => setActiveSection("logs")}>
              <h3>Total Logs</h3>
              <p>{statistics.total_logs}</p>
            </div>
          </div>
        )}
        {renderSection()}
      </div>
    </Layout>
  );
};

export default AdminDashboard;
