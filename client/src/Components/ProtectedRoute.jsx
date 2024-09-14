import React from "react";
import Cookies from "js-cookie";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ element: Component }) => {
  const isLoggedIn = Cookies.get("token");
  const location = useLocation();
  if (!isLoggedIn) localStorage.setItem("redirectPath", location.pathname);
  return isLoggedIn ? Component : <Navigate to="/login" />;
};
export default ProtectedRoute;
