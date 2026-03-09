import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const SharedHorse = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const hasFetched = useRef(false);
  const location = useLocation();

  // 🔍 Captura a URL e extrai os parâmetros corretamente
  const fullUrl = `${location.pathname}${location.search}`;
  console.log("Full URL received:", fullUrl);

  const correctedUrl = fullUrl.includes("?") ? fullUrl : fullUrl.replace("&horseImage", "?horseImage");
  console.log("Corrected URL before processing:", correctedUrl);

  const cleanToken = token ? token.split("&")[0].split("?")[0] : "";
  console.log("Correct token captured:", cleanToken);

  const queryParams = new URLSearchParams(correctedUrl.split("?")[1] || "");
  const horseImage = queryParams.get("horseImage") || "";
  const horseName = queryParams.get("horseName") || "";

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const authToken = localStorage.getItem('authToken');

    console.log("Extra parameters captured:", queryParams.toString(), "| horseImage:", horseImage, "| horseName:", horseName);

    if (authToken && cleanToken) {
      fetch(`${process.env.REACT_APP_API_SERVER_URL}/horses/shared/${cleanToken}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("API response:", data);
          if (data.error) {
            console.log("🚨 Link já foi usado, redirecionando para /received com mensagem de erro.");

            // ✅ Guarda no `localStorage` para persistir no reload
            localStorage.setItem('receivedMessage', "⚠️ The horse had already been shared and was not added again.");
            localStorage.setItem('receivedMessageType', "error");

            navigate('/received', { state: { message: "⚠️ The horse had already been shared and was not added again.", type: "error" } });
          } else {
            console.log("✅ Cavalo adicionado com sucesso! Redirecionando para /received");
            navigate('/received');
          }
        })
        .catch((err) => {
          console.log("Error in the request:", err);
          alert(`Error processing the link: ${err.message}`);
        });
    } else if (!authToken && cleanToken) {
      console.log("User not logged in, checking link status before redirecting...");

      fetch(`${process.env.REACT_APP_API_SERVER_URL}/horses/shared/${cleanToken}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("🚨 API Response before redirecting:", data);

          if (data.error && (data.error.includes("used") || data.error.includes("expired"))) {
            // ✅ Link já foi utilizado ou expirou, mostramos erro na Welcome Page
            const errorRedirectUrl = `/welcome?token=${cleanToken}&message=${encodeURIComponent("⚠️ This sharing link has already been used or expired.")}&horseImage=${encodeURIComponent(horseImage)}&horseName=${encodeURIComponent(horseName)}`;
            console.log("Redirecting to Welcome Page with error:", errorRedirectUrl);
            navigate(errorRedirectUrl);
          } else {
            // ✅ Link ainda válido, redirecionamos normalmente
            const queryString = new URLSearchParams({ horseImage, horseName }).toString();
            const redirectUrl = `/welcome?redirect=${correctedUrl}&token=${cleanToken}&${queryString}`;
            console.log("Redirecting to:", redirectUrl);
            navigate(redirectUrl);
          }
        })
        .catch((err) => {
          console.log("Error in request:", err);
          navigate(`/welcome?token=${cleanToken}&message=${encodeURIComponent("❌ Error checking the link.")}&horseImage=${encodeURIComponent(horseImage)}&horseName=${encodeURIComponent(horseName)}`);
        });
    }
  }, [cleanToken, correctedUrl, navigate]);

  return <p>Processing the link...</p>;
};

export default SharedHorse;
