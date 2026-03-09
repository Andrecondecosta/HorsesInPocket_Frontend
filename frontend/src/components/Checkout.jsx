import React from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const Checkout = ({ plan }) => {
  const handleCheckout = async () => {
    const stripe = await stripePromise;

    const response = await fetch(
      `${process.env.REACT_APP_API_SERVER_URL}/payments/create_checkout_session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      }
    );

    const session = await response.json();

    // Redireciona o usuário para o checkout do Stripe
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.error(result.error);
    }
  };

  return <button onClick={handleCheckout}>Mudar para {plan}</button>;
};

export default Checkout;
