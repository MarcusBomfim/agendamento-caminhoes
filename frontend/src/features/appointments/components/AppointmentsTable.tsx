import { Ban, Check, CheckCheck, Container, MapPin } from "lucide-react";
import type { Appointment, AppointmentStatus } from "../types";
import { StatusBadge } from "./StatusBadge";

interface AppointmentsTableProps {
  appointments: Appointment[];
  onStatusChange: (id: string, status: AppointmentStatus) => void;
  onClearFilters: () => void;
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" })
    .format(new Date(`${date}T12:00:00`))
    .replace(".", "");
}

export function AppointmentsTable({ appointments, onStatusChange, onClearFilters }: AppointmentsTableProps) {
  if (appointments.length === 0) {
    return <div className="appointments-empty"><span><Container size={28} /></span><h3>Nenhum agendamento encontrado</h3><p>Altere os filtros ou cadastre uma nova janela operacional.</p><button type="button" onClick={onClearFilters}>Limpar filtros</button></div>;
  }

  return (
    <div className="appointments-table-scroll">
      <table className="management-table">
        <caption className="sr-only">Lista de agendamentos portuários</caption>
        <thead><tr><th>Agendamento</th><th>Transportadora</th><th>Motorista e veículo</th><th>Terminal</th><th>Operação</th><th>Status</th><th><span className="sr-only">Ações</span></th></tr></thead>
        <tbody>{appointments.map((appointment) => (
          <tr key={appointment.id}>
            <td><div className="schedule-cell"><strong>{appointment.scheduledTime}</strong><span>{formatDate(appointment.scheduledDate)}</span><small>{appointment.id}</small></div></td>
            <td><strong>{appointment.carrier}</strong><small>{appointment.estimatedMinutes} min</small></td>
            <td><strong>{appointment.driver}</strong><small>{appointment.vehiclePlate}</small></td>
            <td><strong className="terminal-name"><MapPin size={13} />{appointment.terminal}</strong><small>{appointment.gate}</small></td>
            <td><span className={`operation-tag ${appointment.operation === "IMPORTAÇÃO" ? "operation-import" : "operation-export"}`}>{appointment.operation}</span>{appointment.containerNumber && <small>{appointment.containerNumber}</small>}</td>
            <td><StatusBadge status={appointment.status} /></td>
            <td><div className="row-actions">
              {appointment.status === "PENDENTE" && <button type="button" onClick={() => onStatusChange(appointment.id, "CONFIRMADO")} title="Confirmar"><Check size={16} /></button>}
              {appointment.status === "EM_PÁTIO" && <button type="button" onClick={() => onStatusChange(appointment.id, "CONCLUÍDO")} title="Concluir"><CheckCheck size={16} /></button>}
              {!(["CONCLUÍDO", "CANCELADO"] as AppointmentStatus[]).includes(appointment.status) && <button className="danger-row-action" type="button" onClick={() => onStatusChange(appointment.id, "CANCELADO")} title="Cancelar"><Ban size={16} /></button>}
            </div></td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}
