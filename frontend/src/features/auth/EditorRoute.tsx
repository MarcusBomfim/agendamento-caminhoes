import { Navigate, Outlet } from "react-router";
import { useAuth } from "./useAuth";

export function EditorRoute() {
  const { user } = useAuth();
  return user?.role !== "VIEWER" ? <Outlet /> : <Navigate to="/dashboard" replace />;
}
