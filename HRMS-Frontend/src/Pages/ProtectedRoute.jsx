import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../Context/Authcontext";

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user } = useContext(AuthContext);

  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/" />;
  }

  // ✅ If roles exist, then check
  if (roles.length > 0 && !roles.includes(user.role?.toLowerCase())) {
    return <Navigate to="/home" />;
  }

  // ✅ Allow access
  return children;
};

export default ProtectedRoute;