import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const SharedHorse = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const hasFetched = useRef(false);
  const location = useLocation();

  // 🔍 Capture the full URL as received
  const fullUrl = `${location.pathname}${location.search}`;
  console.log("Full URL received:", fullUrl);

  // 🔍 Correct the URL if the parameters don't have "?" properly
  const correctedUrl = fullUrl.includes("?") ? fullUrl : fullUrl.replace("&horseImage", "?horseImage");
  console.log("Corrected URL before processing:", correctedUrl);

  // 🔍 Extract the token correctly
  const cleanToken = token ? token.split("&")[0].split("?")[0] : "";
  console.log("Correct token captured:", cleanToken);

  // 🔍 Correctly capture the parameters from the corrected URL
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
            navigate('/received', { state: { message: "The horse had already been shared and was not added again." } });
          } else {
            navigate('/received');
          }
        })
        .catch((err) => {
          console.log("Error in the request:", err);
          alert(`Error processing the link: ${err.message}`);
        });
    } else if (!authToken && cleanToken) {
      console.log("User not logged in, redirecting to welcome with the full URL...");

      // 🔥 Ensure that `cleanToken` is in the query string correctly
      const queryString = new URLSearchParams({ horseImage, horseName }).toString();
      const redirectUrl = `/welcome?redirect=${correctedUrl}&token=${cleanToken}&${queryString}`;

      console.log("Redirecting to:", redirectUrl);
      navigate(redirectUrl);
    }
  }, [cleanToken, correctedUrl, navigate]);

  return <p>Processing the link...</p>;
};

export default SharedHorse;
