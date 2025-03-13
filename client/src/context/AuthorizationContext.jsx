import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

const authContext = createContext();

function AuthorizationContext({ children }) {
  const [user, setUser] = useState(null);

  const loginForContext = (token, userData) => {
    Cookies.set("authToken", token);
    console.log("the cookie is now set ", Cookies.get("authToken"));
    setUser(userData);
  };
  useEffect(() => {
    console.log(Cookies.get("authToken"));
  }, [user]);
  const logout = () => {
    Cookies.remove("authToken");
    setUser(null);
  };

  const role = () => {
    return user?.role || null;
  };
  const isAutheticated = () => {
    return Boolean(Cookies.get("authToken"));
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
