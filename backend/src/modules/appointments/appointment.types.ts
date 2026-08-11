export type AppointmentStatus = "PENDENTE" | "CONFIRMADO" | "EM_PÁTIO" | "CONCLUÍDO" | "ATRASADO" | "CANCELADO";
export type OperationType = "IMPORTAÇÃO" | "EXPORTAÇÃO";

export interface Appointment {
  id: string;
  scheduledDate: string;
  scheduledTime: string;
  estimatedMinutes: number;
  carrier: string;
  driverId: string;
  vehicleId: string;
  terminalId: string;
  gate: string;
  operation: OperationType;
  containerNumber: string;
  status: AppointmentStatus;
  notes: string;
  createdAt: string;
  createdBy?: string;
}

export type NewAppointment = Omit<Appointment, "id" | "status" | "createdAt" | "createdBy">;

export interface AppointmentFilters {
  status?: AppointmentStatus;
  date?: string;
  terminalId?: string;
}
