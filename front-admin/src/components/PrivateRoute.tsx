import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute() {
  const token =
    localStorage.getItem("access_token") || sessionStorage.getItem("access_token");

  // Əgər token yoxdursa, login səhifəsinə yönləndir
  if (!token) {
    return <Navigate to="/admin" replace />;
  }

  // Token varsa, istənilən uşaqları göstər
  return <Outlet />;
}
