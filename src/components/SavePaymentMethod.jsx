import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import "./SavePaymentMethod.css";

// ✅ Load the Stripe public key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

// ✅ Payment method form component
const SavePaymentMethodForm = ({ selectedPlan, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  console.log("📢 Selected Plan:", selectedPlan);
  console.log("📢 Sent Price ID:", selectedPlan?.priceId);
  console.log("📢 Plan Name:", selectedPlan?.name);

  const handlePayment = async () => {
    if (!stripe || !elements) return;

    console.log("🔍 Selected plan:", selectedPlan); // 👉 Check in the console if it's correct

    const cardElement = elements.getElement(CardElement);
    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      alert(`Error: ${error.message}`);
      return;
    }

    const response = await fetch(
      `${process.env.REACT_APP_API_SERVER_URL}/payments/create_payment_intent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("authToken")}` // 🔥 Ensures the token is being sent!
        },
        body: JSON.stringify({
          payment_method_id: paymentMethod.id,
          price_id: selectedPlan?.priceId, // 🔥 Confirms it is correct!
          plan: selectedPlan?.name,
        }),
      }
    );

    const data = await response.json();
    console.log("🔍 Backend response:", data); // 👉 Check the backend response

    if (response.ok) {
      alert(`Payment of ${selectedPlan?.price} confirmed!`);
      onPaymentSuccess();
    } else {
      alert(`Error processing payment: ${data.error}`);
    }
  };

  return (
    <div className="payment-container">
      <h2>Secure Payment</h2>
      <p>
        Selected plan: <strong>{selectedPlan?.name}</strong> - {selectedPlan?.price}
      </p>

      <CardElement className="card-input" />

      <div className="payment-buttons">
        <button className="payment-button" onClick={handlePayment}>
          💳 Pay {selectedPlan?.price}
        </button>
        <button className="cancel-button" onClick={() => onPaymentSuccess(false)}>
          ❌ Cancel
        </button>
      </div>
    </div>
  );
};

// ✅ Main component
const SavePaymentMethod = ({ selectedPlan, onPaymentSuccess }) => {
  const [clientSecret, setClientSecret] = useState("");
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!token || !selectedPlan) {
      console.error("❌ Error: Authentication token or plan not found.");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error(`Error fetching profile: ${res.status}`);
        const userData = await res.json();
        setUser(userData);
      } catch (err) {
        console.error("❌ Error fetching user profile:", err);
      }
    };

    const fetchSetupIntent = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_SERVER_URL}/payments/create_setup_intent`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(`HTTP Error ${res.status}: ${data.error || "Unknown error"}`);
        }

        if (data.client_secret) {
          setClientSecret(data.client_secret);
        } else {
          throw new Error("Unexpected response: client_secret not found.");
        }
      } catch (err) {
        console.error("❌ Error fetching Setup Intent:", err);
      }
    };

    fetchUserProfile();
    fetchSetupIntent();
  }, [token, selectedPlan]); // 🔥 Now depends on the selected plan

  if (!clientSecret || !user || !selectedPlan) {
    return <p>Loading payment information...</p>;
  }

  return (
    <>
      {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <SavePaymentMethodForm
            clientSecret={clientSecret}
            user={user}
            selectedPlan={selectedPlan}
            onPaymentSuccess={onPaymentSuccess} // 🔥 Added here
          />
        </Elements>
      )}
    </>
  );
};

export default SavePaymentMethod;
