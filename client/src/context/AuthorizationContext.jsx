import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

const authContext = createContext();

function AuthorizationContext({ children }) {
  const [user, setUser] = useState(null);

  const loginForContext = (token, userData) => {
    Cookies.set("authToken", token);
    setUser(userData);
  };
  useEffect(() => {
    console.log(user);
  }, [user]);
  const logout = () => {
    Cookies.remove("authToken");
    setUser(null);
  };

  const role = () => {
    return user?.role || null;
  };

  return (
    <authContext.Provider value={{ loginForContext, logout, role, user }}>
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
