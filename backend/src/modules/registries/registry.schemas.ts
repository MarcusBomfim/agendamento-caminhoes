import { z } from "zod";

export const createDriverSchema = z.object({
  name: z.string().trim().min(3),
  cpf: z.string().trim().min(11),
  cnh: z.string().trim().min(9),
  cnhCategory: z.enum(["D", "E"]),
  cnhExpiresAt: z.iso.date(),
  phone: z.string().trim().min(10),
  carrier: z.string().trim().min(2),
});

export const createVehicleSchema = z.object({
  plate: z.string().trim().min(7).max(8).transform((value) => value.toUpperCase()),
  type: z.string().trim().min(2),
  model: z.string().trim().min(2),
  carrier: z.string().trim().min(2),
  renavam: z.string().trim().min(9),
  capacityTons: z.number().positive().max(100),
});

export const createTerminalSchema = z.object({
  name: z.string().trim().min(3),
  code: z.string().trim().min(3).max(6).transform((value) => value.toUpperCase()),
  location: z.string().trim().min(5),
  gates: z.number().int().positive().max(30),
  openingTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  closingTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  hourlyCapacity: z.number().int().positive().max(200),
});

export const driverStatusSchema = z.object({ status: z.enum(["ATIVO", "INATIVO", "BLOQUEADO"]) });
export const vehicleStatusSchema = z.object({ status: z.enum(["DISPONÍVEL", "EM_OPERAÇÃO", "MANUTENÇÃO", "INATIVO"]) });
export const terminalStatusSchema = z.object({ status: z.enum(["OPERACIONAL", "RESTRITO", "INATIVO"]) });
