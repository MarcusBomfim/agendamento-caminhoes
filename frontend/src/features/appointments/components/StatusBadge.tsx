import type { AppointmentStatus } from "../types";

const statusLabels: Record<AppointmentStatus, string> = {
  PENDENTE: "Pendente",
  CONFIRMADO: "Confirmado",
  EM_PÁTIO: "Em pátio",
  CONCLUÍDO: "Concluído",
  ATRASADO: "Atrasado",
  CANCELADO: "Cancelado",
};

const statusClasses: Record<AppointmentStatus, string> = {
  PENDENTE: "pending",
  CONFIRMADO: "confirmed",
  EM_PÁTIO: "yard",
  CONCLUÍDO: "completed",
  ATRASADO: "delayed",
  CANCELADO: "cancelled",
};

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  return <span className={`appointment-status appointment-status-${statusClasses[status]}`}>{statusLabels[status]}</span>;
}
