import type { Route } from "../../shared/http/types.ts";
import { createAppointment, getAppointment, listAppointments, updateAppointmentStatus } from "./appointment.controller.ts";

export const appointmentRoutes: Route[] = [
  { method: "GET", path: "/api/appointments", handler: listAppointments, protected: true },
  { method: "GET", path: "/api/appointments/:id", handler: getAppointment, protected: true },
  { method: "POST", path: "/api/appointments", handler: createAppointment, protected: true },
  { method: "PATCH", path: "/api/appointments/:id/status", handler: updateAppointmentStatus, protected: true },
];
