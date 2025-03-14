import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthorizationContext";

function PrivateRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [initialized, setInitialized] = useState(false);

  // Wait for user data to be loaded
  useEffect(() => {
    if (user !== null || localStorage.getItem("user") === null) {
      setInitialized(true);
    }
  }, [user]);

  // Redirect if not authenticated or not authorized
  useEffect(() => {
    if (initialized) {
      if (!isAuthenticated()) {
        navigate("/");
      } else if (!allowedRoles.includes(user?.role)) {
        navigate("/");
      }
    }
  }, [initialized, isAuthenticated, user, allowedRoles, navigate]);

  // Show loading while initializing
  if (!initialized) {
    return <div>Loading...</div>;
  }

  // If authenticated and authorized, render the component
  return isAuthenticated() && allowedRoles.includes(user?.role)
    ? children
    : null;
}

export default PrivateRoute;
