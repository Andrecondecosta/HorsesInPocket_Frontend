import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const SharedHorse = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const hasFetched = useRef(false); // Flag para garantir que a requisição só ocorra uma vez

  const cleanToken = token.split("?")[0];

  useEffect(() => {
    if (hasFetched.current) return;

    hasFetched.current = true;

    const authToken = localStorage.getItem('authToken');

    console.log("Token capturado da URL:", cleanToken); // ✅ Só o token
    console.log("Token de Autenticação:", authToken);

    if (authToken && cleanToken) {
      fetch(`${process.env.REACT_APP_API_SERVER_URL}/horses/shared/${cleanToken}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Resposta da API:", data);
          if (data.error) {
            alert(data.error);
          } else {
            navigate('/received');
          }
        })
        .catch((err) => {
          console.log("Erro na requisição:", err);
          alert(`Erro ao processar o link: ${err.message}`);
        });
    } else if (!authToken && cleanToken) {
      navigate(`/welcome?redirect=/received&token=${cleanToken}`);
    }
  }, [cleanToken, navigate]);

  return <p>A processar o link...</p>;
};

export default SharedHorse;
