import { Navigate, Outlet } from "react-router";
import { useAuth } from "./useAuth";

export function AdminRoute() {
  const { user } = useAuth();
  return user?.role === "ADMIN" ? <Outlet /> : <Navigate to="/dashboard" replace />;
}
