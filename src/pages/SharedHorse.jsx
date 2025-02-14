import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const SharedHorse = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const hasFetched = useRef(false);
  const location = useLocation(); // Captura a URL completa

  // 🔍 Certifica-te que o token não contém parâmetros extra
  const cleanToken = token ? token.split("&")[0].split("?")[0] : "";

  // 🔍 Captura os parâmetros corretamente
  const queryParams = new URLSearchParams(location.search);
  const horseImage = queryParams.get("horseImage");
  const horseName = queryParams.get("horseName");

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const authToken = localStorage.getItem('authToken');

    console.log("Token correto capturado da URL:", cleanToken);
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
      const redirectUrl = `/welcome?redirect=/received&token=${cleanToken}${
        horseImage ? `&horseImage=${encodeURIComponent(horseImage)}` : ""
      }${horseName ? `&horseName=${encodeURIComponent(horseName)}` : ""}`;

      console.log("Redirecionando para:", redirectUrl);
      navigate(redirectUrl);
    }
  }, [cleanToken, location.search, navigate]);

  return <p>A processar o link...</p>;
};

export default SharedHorse;
