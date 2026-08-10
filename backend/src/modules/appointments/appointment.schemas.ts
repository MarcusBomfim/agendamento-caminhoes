import { z } from "zod";

export const appointmentStatusSchema = z.enum(["PENDENTE", "CONFIRMADO", "EM_PÁTIO", "CONCLUÍDO", "ATRASADO", "CANCELADO"]);

export const createAppointmentSchema = z.object({
  scheduledDate: z.iso.date(),
  scheduledTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  estimatedMinutes: z.number().int().min(15).max(180),
  carrier: z.string().trim().min(2),
  driverId: z.string().trim().min(1),
  vehicleId: z.string().trim().min(1),
  terminalId: z.string().trim().min(1),
  gate: z.string().trim().min(3),
  operation: z.enum(["IMPORTAÇÃO", "EXPORTAÇÃO"]),
  containerNumber: z.string().trim().max(20).default(""),
  notes: z.string().trim().max(300).default(""),
});

export const updateAppointmentStatusSchema = z.object({ status: appointmentStatusSchema });
