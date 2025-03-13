import React, { Children } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function PrivateRoute({ children }) {
  console.log("inside private route");
  const navigate = useNavigate();
  const token = Cookies.get("authToken");
  console.log(token);
  if (!token) {
    navigate("/");
    return null;
  }
  return children;
}

export default PrivateRoute;
