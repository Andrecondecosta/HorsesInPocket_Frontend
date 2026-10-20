import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

// Mensagem a mostrar conforme o código HTTP de GET /horses/shared/:token
// (403 = link já usado, 404 = link inexistente, outros = erro do servidor)
const sharedLinkErrorMessage = (status) => {
  if (status === 403) return "This sharing link has already been used or expired.";
  if (status === 404) return "This sharing link is invalid.";
  return "Error processing the sharing link. Please try again.";
};

const SharedHorse = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const hasFetched = useRef(false);
  const location = useLocation();

  // Capture URL and extract parameters correctly
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
        .then((response) => {
          if (response.ok) {
            console.log("Horse added successfully! Redirecting to /received");
            navigate('/received');
            return;
          }

          const message = sharedLinkErrorMessage(response.status);
          console.log("Share link error:", response.status, message);
          navigate('/received', { state: { message, type: "error" } });
        })
        .catch((err) => {
          console.log("Error in the request:", err);
          alert(`Error processing the link: ${err.message}`);
        });
    } else if (!authToken && cleanToken) {
      console.log("User not logged in, checking link status before redirecting...");

      fetch(`${process.env.REACT_APP_API_SERVER_URL}/horses/shared/${cleanToken}`)
        .then((response) => {
          console.log("API status before redirecting:", response.status);

          // Sem login, o backend responde 401 a qualquer link existente (sem o consumir),
          // por isso só um 404 ou um erro do servidor indicam um problema com o link.
          if (response.status !== 401) {
            const errorRedirectUrl = `/welcome?token=${cleanToken}&message=${encodeURIComponent(sharedLinkErrorMessage(response.status))}&horseImage=${encodeURIComponent(horseImage)}&horseName=${encodeURIComponent(horseName)}`;
            console.log("Redirecting to Welcome Page with error:", errorRedirectUrl);
            navigate(errorRedirectUrl);
          } else {
            const queryString = new URLSearchParams({ horseImage, horseName }).toString();
            const redirectUrl = `/welcome?redirect=${correctedUrl}&token=${cleanToken}&${queryString}`;
            console.log("Redirecting to:", redirectUrl);
            navigate(redirectUrl);
          }
        })
        .catch((err) => {
          console.log("Error in request:", err);
          navigate(`/welcome?token=${cleanToken}&message=${encodeURIComponent("Error checking the link.")}&horseImage=${encodeURIComponent(horseImage)}&horseName=${encodeURIComponent(horseName)}`);
        });
    }
  }, [cleanToken, correctedUrl, navigate]);

  return <p>Processing the link...</p>;
};

export default SharedHorse;
