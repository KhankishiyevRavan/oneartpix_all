import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

interface RestrictedRouteProps {
  blockedRoles: string[];
  redirectTo: string;
  children: ReactNode;
}

const RestrictedRoute = ({ blockedRoles, redirectTo, children }: RestrictedRouteProps) => {
  const role = localStorage.getItem("role");

  if (role && blockedRoles.includes(role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default RestrictedRoute;
