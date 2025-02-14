import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const SharedHorse = () => {
  const { token } = useParams(); // Mantemos o useParams() para não perder a lógica de autenticação
  const navigate = useNavigate();
  const hasFetched = useRef(false);
  const location = useLocation(); // Captura a URL completa

  // 🔍 Captura primeiro a URL inteira antes de processar o token
  const fullUrl = `${location.pathname}${location.search}`;
  console.log("URL completa recebida:", fullUrl);

  // 🔍 Garante que o token está limpo e correto
  const cleanToken = token ? token.split("&")[0].split("?")[0] : "";
  console.log("Token correto capturado:", cleanToken);

  // 🔍 Captura os parâmetros corretamente
  const queryParams = new URLSearchParams(location.search);
  const horseImage = queryParams.get("horseImage");
  const horseName = queryParams.get("horseName");

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const authToken = localStorage.getItem('authToken');

    console.log("Parâmetros extras capturados:", location.search, "| horseImage:", horseImage, "| horseName:", horseName);

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

      // 🔥 Redirecionar para welcome mantendo os parâmetros
      const redirectUrl = `/welcome?redirect=/received&token=${cleanToken}${location.search}`;

      console.log("Redirecionando para:", redirectUrl);
      navigate(redirectUrl);
    }
  }, [cleanToken, location.search, navigate]);

  return <p>A processar o link...</p>;
};

export default SharedHorse;
