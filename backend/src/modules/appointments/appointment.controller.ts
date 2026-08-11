import type { RouteHandler } from "../../shared/http/types.ts";
import { createAppointmentSchema, appointmentStatusSchema, updateAppointmentStatusSchema } from "./appointment.schemas.ts";
import { appointmentService } from "./appointment.service.ts";

export const listAppointments: RouteHandler = async ({ query }) => { const statusValue = query.get("status"); const status = statusValue ? appointmentStatusSchema.parse(statusValue) : undefined; const date = query.get("date") || undefined; const terminalId = query.get("terminalId") || undefined; return { body: { data: await appointmentService.list({ status, date, terminalId }) } }; };
export const getAppointment: RouteHandler = async ({ params }) => ({ body: { data: await appointmentService.findById(params.id ?? "") } });
export const createAppointment: RouteHandler = async ({ body, user }) => ({ status: 201, body: { data: await appointmentService.create(createAppointmentSchema.parse(body), user?.id) } });
export const updateAppointmentStatus: RouteHandler = async ({ params, body }) => ({ body: { data: await appointmentService.updateStatus(params.id ?? "", updateAppointmentStatusSchema.parse(body).status) } });
