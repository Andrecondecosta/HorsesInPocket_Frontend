import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const SharedHorse = () => {
  const { token } = useParams();  // Captura o token da URL
  const navigate = useNavigate();
  const hasFetched = useRef(false);  // Flag para garantir que a requisição só ocorra uma vez

  useEffect(() => {
    if (hasFetched.current) return; // Impede a execução duplicada
    hasFetched.current = true; // Marca que já foi executado

    const authToken = localStorage.getItem('authToken'); // Token de autenticação
    const tokenFromUrl = token; // Captura o token da URL

    console.log('Token da URL:', tokenFromUrl); // Verificação se o token está correto

    if (authToken && tokenFromUrl) {
      // Se o usuário estiver logado, faz a requisição para o backend apenas com o token
      fetch(`${process.env.REACT_APP_API_SERVER_URL}/horses/shared/${tokenFromUrl}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,  // Passando o token de autenticação
        },
      })
        .then((response) => {
          console.log('Resposta da API:', response); // Verificação da resposta da API
          return response.json();
        })
        .then((data) => {
          if (data.error) {
            alert(data.error); // Exibe erro caso ocorra
          } else {
            // Se tudo der certo, redireciona para a página de recebidos
            navigate('/received');
          }
        })
        .catch((err) => {
          console.error('Erro ao processar o link:', err); // Exibe erro caso a requisição falhe
          alert('Erro ao processar o link');
        });
    } else if (!authToken && tokenFromUrl) {
      // Se não estiver logado, redireciona para o login
      navigate(`/welcome?redirect=/received&token=${tokenFromUrl}`);
    }
  }, [token, navigate]);

  return <p>A processar o link...</p>; // Exibição enquanto o link está sendo processado
};

export default SharedHorse;
