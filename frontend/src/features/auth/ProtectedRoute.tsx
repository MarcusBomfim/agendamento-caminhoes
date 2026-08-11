import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "./useAuth";

export function ProtectedRoute() {
  const { authenticated } = useAuth();
  const location = useLocation();
  return authenticated ? <Outlet /> : <Navigate to="/login" replace state={{ from: location.pathname }} />;
}
