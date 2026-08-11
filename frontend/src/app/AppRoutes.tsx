import { Navigate, Route, Routes } from "react-router";
import { AppLayout } from "../components/layout/AppLayout";
import { AppointmentsPage } from "../features/appointments/pages/AppointmentsPage";
import { NewAppointmentPage } from "../features/appointments/pages/NewAppointmentPage";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { DashboardPage } from "../features/dashboard/pages/DashboardPage";
import { DriversPage } from "../features/drivers/pages/DriversPage";
import { TerminalsPage } from "../features/terminals/pages/TerminalsPage";
import { VehiclesPage } from "../features/vehicles/pages/VehiclesPage";
import { ProtectedRoute } from "../features/auth/ProtectedRoute";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/agendamentos" element={<AppointmentsPage />} />
          <Route path="/agendamentos/novo" element={<NewAppointmentPage />} />
          <Route path="/motoristas" element={<DriversPage />} />
          <Route path="/veiculos" element={<VehiclesPage />} />
          <Route path="/terminais" element={<TerminalsPage />} />
        </Route>
      </Route>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
