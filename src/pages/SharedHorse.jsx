import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const SharedHorse = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const hasFetched = useRef(false);
  const location = useLocation();

  // 🔍 Captura a URL completa como está recebida
  const fullUrl = `${location.pathname}${location.search}`;
  console.log("URL completa recebida:", fullUrl);

  // 🔍 Corrigir a URL se os parâmetros não tiverem "?" corretamente
  const correctedUrl = fullUrl.includes("?") ? fullUrl : fullUrl.replace("&horseImage", "?horseImage");
  console.log("URL corrigida antes de processar:", correctedUrl);

  // 🔍 Extrai o token corretamente
  const cleanToken = token ? token.split("&")[0].split("?")[0] : "";
  console.log("Token correto capturado:", cleanToken);

  // 🔍 Captura os parâmetros corretamente da URL corrigida
  const queryParams = new URLSearchParams(correctedUrl.split("?")[1] || "");
  const horseImage = queryParams.get("horseImage");
  const horseName = queryParams.get("horseName");

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const authToken = localStorage.getItem('authToken');

    console.log("Parâmetros extras capturados:", queryParams.toString(), "| horseImage:", horseImage, "| horseName:", horseName);

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
      console.log("Usuário não logado, redirecionando para welcome com a URL completa...");

      // 🔥 Removemos encodeURIComponent para evitar codificação dupla
      const redirectUrl = `/welcome?redirect=${correctedUrl}`;

      console.log("Redirecionando para:", redirectUrl);
      navigate(redirectUrl);
    }
  }, [cleanToken, correctedUrl, navigate]);

  return <p>A processar o link...</p>;
};

export default SharedHorse;
