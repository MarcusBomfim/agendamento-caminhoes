import type { Route } from "../../shared/http/types.ts";
import { createAppointment, getAppointment, listAppointments, updateAppointmentStatus } from "./appointment.controller.ts";

export const appointmentRoutes: Route[] = [
  { method: "GET", path: "/api/appointments", handler: listAppointments },
  { method: "GET", path: "/api/appointments/:id", handler: getAppointment },
  { method: "POST", path: "/api/appointments", handler: createAppointment },
  { method: "PATCH", path: "/api/appointments/:id/status", handler: updateAppointmentStatus },
];
