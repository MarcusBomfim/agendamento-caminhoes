export type StatIconName = "calendar" | "truck" | "completed" | "warning";
export type StatTone = "blue" | "teal" | "green" | "orange";
export type AppointmentStatus = "CONFIRMADO" | "EM PÁTIO" | "ATRASADO" | "AGUARDANDO";
export type AlertTone = "warning" | "info" | "success";

export interface DashboardStat {
  label: string;
  value: number;
  helper: string;
  variation: string;
  icon: StatIconName;
  tone: StatTone;
}

export interface TerminalCapacity {
  name: string;
  location: string;
  scheduled: number;
  capacity: number;
}

export interface StatusSummary {
  label: string;
  value: number;
  color: string;
}

export interface UpcomingAppointment {
  id: string;
  time: string;
  carrier: string;
  driver: string;
  plate: string;
  terminal: string;
  operation: "Importação" | "Exportação";
  status: AppointmentStatus;
}

export interface OperationAlert {
  id: number;
  title: string;
  description: string;
  time: string;
  tone: AlertTone;
}

