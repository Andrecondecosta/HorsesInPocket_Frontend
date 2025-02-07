import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const SharedHorse = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const hasFetched = useRef(false); // Flag para garantir que a requisição só ocorra uma vez

  useEffect(() => {
    if (hasFetched.current) return; // Impede a execução duplicada

    hasFetched.current = true; // Marca que já foi executado

    const authToken = localStorage.getItem('authToken');
    const tokenFromUrl = token; // Pega o token da URL

    if (authToken && tokenFromUrl) {
      // Se já estiver logado, faz a requisição para adicionar o cavalo aos recebidos
      fetch(`${process.env.REACT_APP_API_SERVER_URL}/horses/shared/${tokenFromUrl}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            alert(data.error);
          } else {
            // Redireciona para a página de recebidos
            navigate('/received');
          }
        })
        .catch((err) => alert(`Erro ao processar o link: ${err.message}`));
    } else if (!authToken && tokenFromUrl) {
      // Se não estiver logado, redireciona para o welcome antes do login
      navigate(`/welcome?redirect=/login&token=${tokenFromUrl}`);
    } else {
      // Se não houver token, redireciona para o login diretamente
      navigate(`/login`);
    }
  }, [token, navigate]); // Dependências de token e navigate para garantir execução correta

  return <p>A processar o link...</p>;
};

export default SharedHorse;
