import React from "react";
import { Navigate } from "react-router-dom";
import { usePrivy } from "@privy-io/react-auth";

const PrivateRoute = ({ component }) => {
  const { authenticated, ready } = usePrivy();
  if (!ready) {
    return <div>Loading...</div>;
  }

  return authenticated ? component : <Navigate to="/login" replace={true} />;
};

export default PrivateRoute;
