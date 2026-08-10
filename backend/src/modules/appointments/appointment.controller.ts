import type { RouteHandler } from "../../shared/http/types.ts";
import { createAppointmentSchema, appointmentStatusSchema, updateAppointmentStatusSchema } from "./appointment.schemas.ts";
import { appointmentService } from "./appointment.service.ts";

export const listAppointments: RouteHandler = ({ query }) => {
  const statusValue = query.get("status");
  const status = statusValue ? appointmentStatusSchema.parse(statusValue) : undefined;
  const date = query.get("date") || undefined;
  const terminalId = query.get("terminalId") || undefined;
  return { body: { data: appointmentService.list({ status, date, terminalId }) } };
};

export const getAppointment: RouteHandler = ({ params }) => ({ body: { data: appointmentService.findById(params.id ?? "") } });
export const createAppointment: RouteHandler = ({ body }) => ({ status: 201, body: { data: appointmentService.create(createAppointmentSchema.parse(body)) } });
export const updateAppointmentStatus: RouteHandler = ({ params, body }) => ({ body: { data: appointmentService.updateStatus(params.id ?? "", updateAppointmentStatusSchema.parse(body).status) } });
