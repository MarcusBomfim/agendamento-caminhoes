import { databaseEnabled, query } from "../../database/client.ts";
import type { Appointment, AppointmentFilters, AppointmentStatus, NewAppointment, OperationType } from "./appointment.types.ts";

function demoDate(offsetDays = 0) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

const demoCreatedAt = (hoursAgo: number) => new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString();

const appointments: Appointment[] = [
  { id: "PA-DEMO-101", scheduledDate: demoDate(), scheduledTime: "07:00", estimatedMinutes: 45, carrier: "Rota Litoral", driverId: "MOT-001", vehicleId: "VEI-001", terminalId: "TER-001", gate: "Portão 01", operation: "IMPORTAÇÃO", containerNumber: "MSCU1234567", status: "CONCLUÍDO", notes: "Descarga concluída sem ocorrências", createdAt: demoCreatedAt(30) },
  { id: "PA-DEMO-102", scheduledDate: demoDate(), scheduledTime: "07:30", estimatedMinutes: 45, carrier: "Transmar Logística", driverId: "MOT-002", vehicleId: "VEI-002", terminalId: "TER-002", gate: "Portão 02", operation: "EXPORTAÇÃO", containerNumber: "TCLU7654321", status: "CONCLUÍDO", notes: "Lacre conferido na saída", createdAt: demoCreatedAt(28) },
  { id: "PA-DEMO-103", scheduledDate: demoDate(), scheduledTime: "08:00", estimatedMinutes: 45, carrier: "Eixo Sul Cargas", driverId: "MOT-004", vehicleId: "VEI-004", terminalId: "TER-004", gate: "Portão 04", operation: "IMPORTAÇÃO", containerNumber: "HLCU4829156", status: "EM_PÁTIO", notes: "Aguardando direcionamento para a doca", createdAt: demoCreatedAt(24) },
  { id: "PA-DEMO-104", scheduledDate: demoDate(), scheduledTime: "08:20", estimatedMinutes: 60, carrier: "Atlas Rodoviário", driverId: "MOT-006", vehicleId: "VEI-006", terminalId: "TER-001", gate: "Portão 03", operation: "EXPORTAÇÃO", containerNumber: "MAEU7319042", status: "CONFIRMADO", notes: "Carga refrigerada", createdAt: demoCreatedAt(22) },
  { id: "PA-DEMO-105", scheduledDate: demoDate(), scheduledTime: "09:00", estimatedMinutes: 45, carrier: "Baixada Cargas", driverId: "MOT-007", vehicleId: "VEI-007", terminalId: "TER-005", gate: "Portão 02", operation: "IMPORTAÇÃO", containerNumber: "CMAU6942180", status: "ATRASADO", notes: "Atraso informado na Rodovia Anchieta", createdAt: demoCreatedAt(20) },
  { id: "PA-DEMO-106", scheduledDate: demoDate(), scheduledTime: "09:30", estimatedMinutes: 30, carrier: "Porto Sul", driverId: "MOT-008", vehicleId: "VEI-009", terminalId: "TER-006", gate: "Portão 01", operation: "EXPORTAÇÃO", containerNumber: "MEDU5183274", status: "PENDENTE", notes: "Aguardando validação documental", createdAt: demoCreatedAt(18) },
  { id: "PA-DEMO-107", scheduledDate: demoDate(), scheduledTime: "10:15", estimatedMinutes: 45, carrier: "Santos Express", driverId: "MOT-009", vehicleId: "VEI-001", terminalId: "TER-003", gate: "Portão 02", operation: "IMPORTAÇÃO", containerNumber: "COSU8402519", status: "CONFIRMADO", notes: "", createdAt: demoCreatedAt(16) },
  { id: "PA-DEMO-108", scheduledDate: demoDate(), scheduledTime: "11:00", estimatedMinutes: 60, carrier: "Transmar Logística", driverId: "MOT-010", vehicleId: "VEI-006", terminalId: "TER-004", gate: "Portão 05", operation: "EXPORTAÇÃO", containerNumber: "ONEU3629741", status: "EM_PÁTIO", notes: "Check-in realizado", createdAt: demoCreatedAt(14) },
  { id: "PA-DEMO-109", scheduledDate: demoDate(), scheduledTime: "12:30", estimatedMinutes: 45, carrier: "Rota Litoral", driverId: "MOT-001", vehicleId: "VEI-007", terminalId: "TER-002", gate: "Portão 03", operation: "IMPORTAÇÃO", containerNumber: "MSCU9083175", status: "PENDENTE", notes: "Conferência de autorização pendente", createdAt: demoCreatedAt(12) },
  { id: "PA-DEMO-110", scheduledDate: demoDate(), scheduledTime: "14:00", estimatedMinutes: 45, carrier: "Transmar Logística", driverId: "MOT-002", vehicleId: "VEI-002", terminalId: "TER-005", gate: "Portão 04", operation: "EXPORTAÇÃO", containerNumber: "TGHU2476108", status: "CONFIRMADO", notes: "", createdAt: demoCreatedAt(10) },
  { id: "PA-DEMO-111", scheduledDate: demoDate(), scheduledTime: "15:30", estimatedMinutes: 30, carrier: "Porto Sul", driverId: "MOT-004", vehicleId: "VEI-008", terminalId: "TER-006", gate: "Portão 02", operation: "IMPORTAÇÃO", containerNumber: "CAIU1736904", status: "CANCELADO", notes: "Cancelado após indisponibilidade mecânica", createdAt: demoCreatedAt(8) },
  { id: "PA-DEMO-112", scheduledDate: demoDate(), scheduledTime: "17:00", estimatedMinutes: 45, carrier: "Atlas Rodoviário", driverId: "MOT-006", vehicleId: "VEI-009", terminalId: "TER-001", gate: "Portão 04", operation: "EXPORTAÇÃO", containerNumber: "SEGU5942817", status: "CONCLUÍDO", notes: "Operação antecipada pela equipe do terminal", createdAt: demoCreatedAt(6) },
  { id: "PA-DEMO-113", scheduledDate: demoDate(1), scheduledTime: "08:00", estimatedMinutes: 45, carrier: "Eixo Sul Cargas", driverId: "MOT-004", vehicleId: "VEI-004", terminalId: "TER-004", gate: "Portão 01", operation: "EXPORTAÇÃO", containerNumber: "TEMU4638291", status: "PENDENTE", notes: "", createdAt: demoCreatedAt(5) },
  { id: "PA-DEMO-114", scheduledDate: demoDate(1), scheduledTime: "09:15", estimatedMinutes: 60, carrier: "Baixada Cargas", driverId: "MOT-007", vehicleId: "VEI-007", terminalId: "TER-005", gate: "Portão 03", operation: "IMPORTAÇÃO", containerNumber: "OOLU8251463", status: "CONFIRMADO", notes: "Necessário pesagem na entrada", createdAt: demoCreatedAt(4) },
  { id: "PA-DEMO-115", scheduledDate: demoDate(1), scheduledTime: "10:45", estimatedMinutes: 45, carrier: "Santos Express", driverId: "MOT-009", vehicleId: "VEI-009", terminalId: "TER-003", gate: "Portão 01", operation: "EXPORTAÇÃO", containerNumber: "TRHU6103972", status: "PENDENTE", notes: "", createdAt: demoCreatedAt(3) },
  { id: "PA-DEMO-116", scheduledDate: demoDate(1), scheduledTime: "13:30", estimatedMinutes: 45, carrier: "Transmar Logística", driverId: "MOT-010", vehicleId: "VEI-006", terminalId: "TER-004", gate: "Portão 06", operation: "IMPORTAÇÃO", containerNumber: "FCIU2947851", status: "CONFIRMADO", notes: "", createdAt: demoCreatedAt(2) },
  { id: "PA-DEMO-117", scheduledDate: demoDate(-1), scheduledTime: "16:00", estimatedMinutes: 45, carrier: "Rota Litoral", driverId: "MOT-001", vehicleId: "VEI-001", terminalId: "TER-001", gate: "Portão 02", operation: "IMPORTAÇÃO", containerNumber: "MSCU7412580", status: "CONCLUÍDO", notes: "Operação finalizada no prazo", createdAt: demoCreatedAt(36) },
  { id: "PA-DEMO-118", scheduledDate: demoDate(-1), scheduledTime: "17:30", estimatedMinutes: 30, carrier: "Navega Log", driverId: "MOT-005", vehicleId: "VEI-005", terminalId: "TER-002", gate: "Portão 01", operation: "EXPORTAÇÃO", containerNumber: "", status: "CANCELADO", notes: "Cadastro inativo no momento do check-in", createdAt: demoCreatedAt(34) },
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
