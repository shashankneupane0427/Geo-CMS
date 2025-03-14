import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthorizationContext";

function PrivateRoute({ children }) {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [initialized, setInitialized] = useState(false);

  // Wait for user data to be loaded from localStorage
  useEffect(() => {
    // If localStorage check has completed (user was either loaded or confirmed not present)
    if (user !== null || localStorage.getItem("user") === null) {
      setInitialized(true);
    }
  }, [user]);

  // Only check authentication after initialization is complete
  useEffect(() => {
    if (initialized && !isAuthenticated()) {
      navigate("/");
    }
  }, [initialized, isAuthenticated, navigate]);

  // Show loading while waiting for initialization
  if (!initialized) {
    return <div>Loading...</div>;
  }

  // If authenticated, render children
  return isAuthenticated() ? children : null;
}

export default PrivateRoute;
