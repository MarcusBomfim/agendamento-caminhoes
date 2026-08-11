import { databaseEnabled, query } from "../../database/client.ts";
import type { Appointment, AppointmentFilters, AppointmentStatus, NewAppointment, OperationType } from "./appointment.types.ts";

const appointments: Appointment[] = [
  { id: "PA-260810-048", scheduledDate: "2026-08-10", scheduledTime: "10:30", estimatedMinutes: 45, carrier: "Rota Litoral", driverId: "MOT-001", vehicleId: "VEI-001", terminalId: "TER-001", gate: "Portão 01", operation: "IMPORTAÇÃO", containerNumber: "MSCU1234567", status: "CONFIRMADO", notes: "", createdAt: "2026-08-09T15:20:00.000Z" },
  { id: "PA-260810-049", scheduledDate: "2026-08-10", scheduledTime: "10:50", estimatedMinutes: 45, carrier: "Transmar Logística", driverId: "MOT-002", vehicleId: "VEI-002", terminalId: "TER-002", gate: "Portão 03", operation: "EXPORTAÇÃO", containerNumber: "TCLU7654321", status: "EM_PÁTIO", notes: "Prioridade operacional", createdAt: "2026-08-09T16:10:00.000Z" },
];

interface AppointmentRow {
  id: string; scheduled_date: string; scheduled_time: string; estimated_minutes: number; carrier: string; driver_id: string; vehicle_id: string; terminal_id: string; gate: string; operation: OperationType; container_number: string; status: AppointmentStatus; notes: string; created_at: Date | string; created_by: string | null;
}

const columns = "id, scheduled_date::text, scheduled_time::text, estimated_minutes, carrier, driver_id, vehicle_id, terminal_id, gate, operation, container_number, status, notes, created_at, created_by";
const mapAppointment = (row: AppointmentRow): Appointment => ({ id: row.id, scheduledDate: row.scheduled_date, scheduledTime: row.scheduled_time.slice(0, 5), estimatedMinutes: row.estimated_minutes, carrier: row.carrier, driverId: row.driver_id, vehicleId: row.vehicle_id, terminalId: row.terminal_id, gate: row.gate, operation: row.operation, containerNumber: row.container_number, status: row.status, notes: row.notes, createdAt: new Date(row.created_at).toISOString(), createdBy: row.created_by ?? undefined });

export class AppointmentRepository {
  async list(filters: AppointmentFilters = {}) {
    if (!databaseEnabled) return appointments.filter((item) => (!filters.status || item.status === filters.status) && (!filters.date || item.scheduledDate === filters.date) && (!filters.terminalId || item.terminalId === filters.terminalId));
    const conditions: string[] = [];
    const values: unknown[] = [];
    if (filters.status) { values.push(filters.status); conditions.push(`status = $${values.length}`); }
    if (filters.date) { values.push(filters.date); conditions.push(`scheduled_date = $${values.length}`); }
    if (filters.terminalId) { values.push(filters.terminalId); conditions.push(`terminal_id = $${values.length}`); }
    const where = conditions.length ? ` WHERE ${conditions.join(" AND ")}` : "";
    return (await query<AppointmentRow>(`SELECT ${columns} FROM appointments${where} ORDER BY scheduled_date DESC, scheduled_time DESC`, values)).rows.map(mapAppointment);
  }

  async findById(id: string) { if (!databaseEnabled) return appointments.find((item) => item.id === id); const row = (await query<AppointmentRow>(`SELECT ${columns} FROM appointments WHERE id = $1`, [id])).rows[0]; return row ? mapAppointment(row) : undefined; }
  async create(id: string, input: NewAppointment, createdBy?: string) { if (!databaseEnabled) { const item: Appointment = { id, ...input, status: "PENDENTE", createdAt: new Date().toISOString(), createdBy }; appointments.unshift(item); return item; } const row = (await query<AppointmentRow>(`INSERT INTO appointments (id, scheduled_date, scheduled_time, estimated_minutes, carrier, driver_id, vehicle_id, terminal_id, gate, operation, container_number, notes, created_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING ${columns}`, [id, input.scheduledDate, input.scheduledTime, input.estimatedMinutes, input.carrier, input.driverId, input.vehicleId, input.terminalId, input.gate, input.operation, input.containerNumber, input.notes, createdBy ?? null])).rows[0]; return mapAppointment(row!); }
  async updateStatus(id: string, status: AppointmentStatus) { if (!databaseEnabled) { const item = appointments.find((entry) => entry.id === id); if (item) item.status = status; return item; } const row = (await query<AppointmentRow>(`UPDATE appointments SET status=$2, updated_at=NOW() WHERE id=$1 RETURNING ${columns}`, [id, status])).rows[0]; return row ? mapAppointment(row) : undefined; }
}

export const appointmentRepository = new AppointmentRepository();
