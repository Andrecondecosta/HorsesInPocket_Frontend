
import React, { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import LoadingPopup from "../components/LoadingPopup";
import "./ProfilePage.css";

const ProfilePage = () => {
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Error loading profile");

        const data = await response.json();
        setUser(data);
      } catch (error) {
        setError("Error loading user data");
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") return;

    setIsDeleting(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/delete_account`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        localStorage.removeItem("authToken");
        alert("Your account has been permanently deleted.");
        navigate("/login");
      } else {
        const data = await res.json();
        alert(data.error || "Error deleting account. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Error deleting account. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) return <LoadingPopup message="Loading..." />;
  if (error) return <p>{error}</p>;


  return (
    <Layout>
      <div className="profile-page-container">
        <h1 className="page-title">Settings</h1>
        <div className="profile-breadcrumb-container">
          <div className="breadcrumbs">
            <Link to="/dashboard">Dashboard</Link> / <span>Settings</span>
          </div>
          <Link to="/update-profile" className="profile-edit-button-link">
            <button className="profile-edit-button" data-testid="profile-edit-button">
              <FaEdit /> Edit
            </button>
          </Link>
        </div>

        <div className="profile-details-container">
          <div className="profile-image">
            <img
              src={
                user.avatar ||
                "https://res.cloudinary.com/dcvtrregd/image/upload/v1736802678/user_1_vl6pae.png"
              }
              alt="Profile Picture"
            />
          </div>

          <div className="profile-details">
            <p>
              <strong>Name:</strong> {user.first_name} {user.last_name}
            </p>
            <p>
              <strong>Date of Birth:</strong> {user.birthdate ? user.birthdate.split('-').reverse().join('/') : 'dd/mm/yyyy'}
            </p>
            <p>
              <strong>Gender:</strong> {user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'Not specified'}
            </p>
            <p>
              <strong>Phone:</strong> {user.phone_number || "Not specified"}
            </p>
            <p>
              <strong>Country:</strong> {user.country || "Not specified"}
            </p>

            {/* Delete Account Section */}
            <div className="delete-account-section" data-testid="delete-account-section">
              <button
                className="delete-account-btn"
                data-testid="delete-account-btn"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete Account
              </button>
            </div>

            {/* Delete Account Confirmation Modal */}
            {showDeleteConfirm && (
              <div className="popup-overlay" data-testid="delete-account-modal">
                <div className="popup-content delete-confirm-modal">
                  <h3>Delete Account</h3>
                  <p>This action is <strong>permanent and irreversible</strong>. All your data, horses, images, and shares will be permanently deleted.</p>
                  <p>Type <strong>DELETE</strong> to confirm:</p>
                  <input
                    type="text"
                    className="delete-confirm-input"
                    data-testid="delete-confirm-input"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder="Type DELETE to confirm"
                  />
                  <div className="delete-confirm-buttons">
                    <button
                      className="delete-confirm-cancel"
                      data-testid="delete-confirm-cancel"
                      onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText(""); }}
                    >
                      Cancel
                    </button>
                    <button
                      className="delete-confirm-yes"
                      data-testid="delete-confirm-yes"
                      disabled={deleteConfirmText !== "DELETE" || isDeleting}
                      onClick={handleDeleteAccount}
                    >
                      {isDeleting ? "Deleting..." : "Delete My Account"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
