export type AppointmentStatus = "PENDENTE" | "CONFIRMADO" | "EM_PÁTIO" | "CONCLUÍDO" | "ATRASADO" | "CANCELADO";
export type OperationType = "IMPORTAÇÃO" | "EXPORTAÇÃO";

export interface Appointment {
  id: string;
  scheduledDate: string;
  scheduledTime: string;
  estimatedMinutes: number;
  carrier: string;
  driver: string;
  vehiclePlate: string;
  terminal: string;
  gate: string;
  operation: OperationType;
  containerNumber: string;
  status: AppointmentStatus;
  notes: string;
  createdAt: string;
}

export interface AppointmentFormValues {
  scheduledDate: string;
  scheduledTime: string;
  estimatedMinutes: "30" | "45" | "60" | "90";
  carrier: string;
  driver: string;
  vehiclePlate: string;
  terminal: string;
  gate: string;
  operation: OperationType;
  containerNumber: string;
  notes: string;
}

