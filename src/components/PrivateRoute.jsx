import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const PrivateRoute = ({ element }) => {
  const { user } = useAuth(); // Check if the user is logged in

  // Return the element or redirect
  return user ? element : <Navigate to="/auth" />;
};

export default PrivateRoute;
