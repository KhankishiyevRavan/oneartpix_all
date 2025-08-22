// components/PrivateRoute.tsx
import { JSX, useEffect } from "react";
import { Navigate } from "react-router";

interface Props {
  children: JSX.Element;
  token: string | null;
}

const PrivateRoute = ({ children, token }: Props) => {
  useEffect(() => {
    console.log("Token dəyişdi:", token); // Token dəyişdikcə konsola yazdır
  }, [token]);

  return token ? children : <Navigate to="/signin" replace />;
};

export default PrivateRoute;
