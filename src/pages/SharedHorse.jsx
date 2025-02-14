import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const SharedHorse = () => {
  const { token } = useParams(); // Captura o token da URL
  const navigate = useNavigate();
  const hasFetched = useRef(false);
  const location = useLocation(); // Captura toda a URL incluindo query params

  // 🔍 Extração correta do token puro (ignora parâmetros extra)
  const cleanToken = token ? token.split("&")[0] : "";

  // 🔍 Capturar toda a query string (parâmetros extra)
  const queryParams = location.search; // Mantém tudo depois de '?'

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const authToken = localStorage.getItem('authToken');

    console.log("Token correto capturado da URL:", cleanToken); // ✅ Apenas o token puro
    console.log("Parâmetros extras na URL:", queryParams); // ✅ Verifica se os parâmetros extra estão capturados

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
      navigate(`/welcome?redirect=/received&token=${cleanToken}${queryParams}`);
    }
  }, [cleanToken, queryParams, navigate]);

  return <p>A processar o link...</p>;
};

export default SharedHorse;
