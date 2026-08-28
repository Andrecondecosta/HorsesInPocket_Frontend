
import React, { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import LoadingPopup from "../components/LoadingPopup";
import SavePaymentMethod from "../components/SavePaymentMethod";
import SubscriptionPlans from "../components/SubscriptionPlans";
import { isNativeiOS } from "../utils/isNative";
import "./ProfilePage.css";

const plans = [
  { name: "Basic", price: "€0,00", priceId: null },
  { name: "Plus", price: "€4,99", priceId: "price_1Qo67GDCGWh9lQnCP4woIdoo" },
  { name: "Premium", price: "€14,99", priceId: "price_1Qo67nDCGWh9lQnCV35pyiym" },
  { name: "Ultimate", price: "€34,99", priceId: "price_1Qo68DDCGWh9lQnCaWeRF1YO" },
];

const ProfilePage = () => {
  const [user, setUser] = useState({});
  const [plan, setPlan] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPlanPopup, setShowPlanPopup] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
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

        const planResponse = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/get_user_plan`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!planResponse.ok) throw new Error("Error loading plan");

        const planData = await planResponse.json();
        setPlan(planData.plan);
      } catch (error) {
        setError("Error loading user data");
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token, refreshKey]);

  const handleSelectPlan = async (plan) => {
    if (!plan) {
      alert("Invalid plan selected.");
      return;
    }

    setSelectedPlan(plan);

    if (plan.priceId) {
      setShowPlanPopup(false);
      setTimeout(() => setShowPaymentPopup(true), 300);
    } else {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/change_plan`, {
          method: "POST",
          body: JSON.stringify({ plan: plan.name }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Error activating free plan.");

        alert(`Plan ${plan.name} activated!`);
        setPlan(plan.name);
        setUser((prevUser) => ({
          ...prevUser,
          subscription_canceled: false,
        }));
        setShowPlanPopup(false);
      } catch (error) {
        alert("Error activating free plan.");
      }
    }
  };

  const handlePaymentSuccess = (newPlan) => {
    setShowPaymentPopup(false);
    setPlan(newPlan);
    setRefreshKey((k) => k + 1);
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm("Are you sure you want to cancel your subscription?")) return;

    try {
      const res = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/payments/cancel_subscription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setRefreshKey((k) => k + 1);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error canceling subscription:", error);
      alert("Error canceling subscription.");
    }
  };

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

  const native = isNativeiOS();

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

            {/* Subscription section — hidden on native iOS for App Store compliance */}
            {!native && (
              <div className="subscription-container" data-testid="subscription-container">
                <div className="subscription-header">
                  <p>
                    <strong>Plan:</strong> {plan}
                  </p>
                  {user?.subscription_end &&
                    new Date(user.subscription_end) > new Date() &&
                    !user?.subscription_canceled && (
                      <p className="subscription-status">
                        <strong>Expires on:</strong>{" "}
                        {new Date(user.subscription_end).toLocaleDateString()}
                      </p>
                    )}
                  {user?.plan !== "Basic" &&
                    user?.subscription_end &&
                    new Date(user.subscription_end) > new Date() &&
                    !user?.subscription_canceled && (
                      <button onClick={handleCancelSubscription} className="cancel-btn" data-testid="cancel-subscription-btn">
                        Cancel Subscription
                      </button>
                    )}
                </div>

                {user?.plan !== "Basic" && user?.subscription_canceled && (
                  <p className="subscription-warning">
                    Your subscription has been canceled and{" "}
                    <strong>will not be renewed after</strong>{" "}
                    {new Date(user.subscription_end).toLocaleDateString()}.
                  </p>
                )}

                <button onClick={() => setShowPlanPopup(true)} className="upgrade-btn" data-testid="upgrade-plan-btn">
                  Upgrade Plan
                </button>
              </div>
            )}

            {/* Payment popups — hidden on native iOS for App Store compliance */}
            {!native && showPlanPopup && (
              <div className="popup-overlay">
                <div className="popup-content">
                  <SubscriptionPlans
                    onSelectPlan={handleSelectPlan}
                    onClose={() => setShowPlanPopup(false)}
                  />
                </div>
              </div>
            )}

            {!native && showPaymentPopup && selectedPlan && (
              <div className="popup-overlay">
                <div className="popup-content1">
                  <SavePaymentMethod
                    selectedPlan={selectedPlan}
                    onPaymentSuccess={() => handlePaymentSuccess(selectedPlan.name)}
                  />
                </div>
              </div>
            )}

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
