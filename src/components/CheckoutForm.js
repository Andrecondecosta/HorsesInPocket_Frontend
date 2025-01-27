import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CheckoutForm = ({ setIsLoggedIn }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Certifique-se de que o Stripe e Elements foram carregados corretamente
      return;
    }

    setIsProcessing(true);

    // Criar o método de pagamento com o cartão
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

    // Aqui, você pode enviar o paymentMethod.id para o seu backend para criar a assinatura
    const response = await fetch('/api/v1/your-api-endpoint', {
      method: 'POST',
      body: JSON.stringify({ paymentMethod: paymentMethod.id }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();

    if (data.success) {
      alert('Pagamento realizado com sucesso!');
      setIsLoggedIn(true); // Se o pagamento for bem-sucedido, você pode marcar o usuário como logado
    } else {
      alert('Erro ao processar o pagamento');
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Informações de Pagamento</h3>
      <CardElement />
      <button type="submit" disabled={!stripe || isProcessing}>
        {isProcessing ? 'Processando...' : 'Pagar'}
      </button>
    </form>
  );
};

export default CheckoutForm;
