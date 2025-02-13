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
      // Se já estiver logado, faz a requisição para adicionar o cavalo diretamente aos "recebidos"
      fetch(`${process.env.REACT_APP_API_SERVER_URL}/horses/shared/${tokenFromUrl}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,  // Envia o token de autenticação
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            alert(data.error); // Exibe um erro caso ocorra
          } else {
            // Se o cavalo foi adicionado com sucesso, redireciona para a página de cavalos recebidos
            navigate('/received');
          }
        })
        .catch((err) => alert(`Erro ao processar o link: ${err.message}`));
    } else if (!authToken && tokenFromUrl) {
      // Se não estiver logado, redireciona para a página de welcome, onde o usuário poderá se autenticar
      navigate(`/welcome?redirect=/received&token=${tokenFromUrl}`);
    }
  }, [token, navigate]);

  return <p>A processar o link...</p>;
};

export default SharedHorse;
