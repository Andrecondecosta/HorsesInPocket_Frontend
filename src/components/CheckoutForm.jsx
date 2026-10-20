import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CheckoutForm = ({ setIsLoggedIn }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    // Create payment method with card
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (error) {
      console.log('[Error]', error);
      setIsProcessing(false);
      alert(error.message);
      return;
    }

    // Send paymentMethod.id to backend to create subscription
    const response = await fetch('/api/v1/your-api-endpoint', {
      method: 'POST',
      body: JSON.stringify({ paymentMethod: paymentMethod.id }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();

    if (data.success) {
      alert('Payment successful!');
      setIsLoggedIn(true);
    } else {
      alert('Error processing payment');
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Payment Information</h3>
      <CardElement />
      <button type="submit" disabled={!stripe || isProcessing}>
        {isProcessing ? 'Processing...' : 'Pay'}
      </button>
    </form>
  );
};

export default CheckoutForm;
