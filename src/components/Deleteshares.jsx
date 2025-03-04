import { useState, useEffect, useRef } from "react";
import { FaTrash, FaChevronDown } from "react-icons/fa";
import "./Deleteshares.css";

export default function DeleteShares({ horseId, token }) {
  const [isOpen, setIsOpen] = useState(false);
  const [shares, setShares] = useState([]);
  const [selectedShares, setSelectedShares] = useState([]);
  const menuRef = useRef(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_SERVER_URL}/horses/${horseId}/shares`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setShares(data.shares || []))
      .catch((err) => console.error("❌ Erro ao carregar partilhas:", err));
  }, [horseId, token]);

  const toggleSelection = (userId) => {
    setSelectedShares((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleDelete = () => {
    fetch(`${process.env.REACT_APP_API_SERVER_URL}/horses/${horseId}/delete_shares`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ user_ids: selectedShares }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao remover partilhas");
        return res.json();
      })
      .then(() => {
        setShares((prev) => prev.filter((share) => !selectedShares.includes(share.user_id)));
        setSelectedShares([]);
        setIsOpen(false); // Fecha a lista após deletar
      })
      .catch((err) => console.error("❌ Erro ao remover partilhas:", err));
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="delete-shares-container" ref={menuRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="delete-option-button">
        <FaTrash /> <p>Delete for Shared</p> <FaChevronDown className={`arrow ${isOpen ? "open" : ""}`} />
      </button>

      {isOpen && (
        <div className="delete-shares-dropdown">
          <h6>Select shares to delete</h6>
          {shares.length > 0 ? (
            <div className="delete-shares-list">
              {shares.map((share) => (
                <label key={share.user_id} className="share-item">
                  <input
                    type="checkbox"
                    checked={selectedShares.includes(share.user_id)}
                    onChange={() => toggleSelection(share.user_id)}
                  />
                  {share.user_name || `User ${share.user_id}`}
                </label>
              ))}
              <button
                onClick={handleDelete}
                disabled={selectedShares.length === 0}
                className="delete-button"
              >
                <FaTrash /> Delete Selected
              </button>
            </div>
          ) : (
            <p className="no-shares">No shares found</p>
          )}
        </div>
      )}
    </div>
  );
}
