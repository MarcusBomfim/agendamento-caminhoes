import type { Appointment, AppointmentFilters, AppointmentStatus, NewAppointment } from "./appointment.types.ts";

const appointments: Appointment[] = [
  { id: "PA-260810-048", scheduledDate: "2026-08-10", scheduledTime: "10:30", estimatedMinutes: 45, carrier: "Rota Litoral", driverId: "MOT-001", vehicleId: "VEI-001", terminalId: "TER-001", gate: "Portão 01", operation: "IMPORTAÇÃO", containerNumber: "MSCU1234567", status: "CONFIRMADO", notes: "", createdAt: "2026-08-09T15:20:00.000Z" },
  { id: "PA-260810-049", scheduledDate: "2026-08-10", scheduledTime: "10:50", estimatedMinutes: 45, carrier: "Transmar Logística", driverId: "MOT-002", vehicleId: "VEI-002", terminalId: "TER-002", gate: "Portão 03", operation: "EXPORTAÇÃO", containerNumber: "TCLU7654321", status: "EM_PÁTIO", notes: "Prioridade operacional", createdAt: "2026-08-09T16:10:00.000Z" },
];

export class AppointmentRepository {
  list(filters: AppointmentFilters = {}) {
    return appointments.filter((item) => (!filters.status || item.status === filters.status) && (!filters.date || item.scheduledDate === filters.date) && (!filters.terminalId || item.terminalId === filters.terminalId));
  }

  findById(id: string) { return appointments.find((item) => item.id === id); }
  create(id: string, input: NewAppointment) { const item: Appointment = { id, ...input, status: "PENDENTE", createdAt: new Date().toISOString() }; appointments.unshift(item); return item; }
  updateStatus(id: string, status: AppointmentStatus) { const item = this.findById(id); if (item) item.status = status; return item; }
}

export const appointmentRepository = new AppointmentRepository();
