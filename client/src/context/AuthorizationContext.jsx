import React, { createContext, useContext, useEffect, useState } from "react";

const authContext = createContext();

function AuthorizationContext({ children }) {
  const [user, setUser] = useState(null);

  // Load user data from localStorage on component mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      // console.log(storedUser);
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        // console.log("Successfully loaded user from localStorage:", parsedUser);
        setUser(parsedUser);
      } else {
        // console.log("No user data found in localStorage");
      }
    } catch (error) {
      // console.error("Error loading user from localStorage:", error);
    }
  }, []);

  const loginForContext = (userData) => {
    setUser(userData);
    // Store user data in localStorage
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    // Remove user data from localStorage
    localStorage.removeItem("user");
  };

  const role = () => {
    return user?.role || null;
  };

  const isAuthenticated = () => {
    return !!user;
  };

  return (
    <authContext.Provider
      value={{ loginForContext, logout, role, user, isAuthenticated }}
    >
      {children}
    </authContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(authContext);
  if (!context) {
    throw new Error("Must be wrapped within provider");
  }
  return context;
};

export default AuthorizationContext;
