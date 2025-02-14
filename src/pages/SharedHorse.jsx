import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const SharedHorse = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const hasFetched = useRef(false);
  const location = useLocation(); // Captura a URL completa

  // 🔍 Captura corretamente o token puro (ignora parâmetros extras)
  const cleanToken = token ? token.split("&")[0] : "";

  // 🔍 Captura manualmente toda a query string original
  const fullQueryString = location.search; // Exemplo: "?horseImage=...&horseName=..."

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const authToken = localStorage.getItem('authToken');

    console.log("Token correto capturado da URL:", cleanToken);
    console.log("Parâmetros extras na URL (location.search):", fullQueryString);

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
      console.log("Usuário não logado, redirecionando para welcome com parâmetros completos...");

      // 🔥 Redirecionamento para `welcome` garantindo que os parâmetros extra são mantidos
      const redirectUrl = `/welcome?redirect=/received&token=${cleanToken}${fullQueryString}`;

      console.log("Redirecionando para:", redirectUrl);
      navigate(redirectUrl);
    }
  }, [cleanToken, fullQueryString, navigate]);

  return <p>A processar o link...</p>;
};

export default SharedHorse;
