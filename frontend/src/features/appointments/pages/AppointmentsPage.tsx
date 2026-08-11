import { CalendarDays, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router";
import { AppointmentFilters, type AppointmentFilterValues } from "../components/AppointmentFilters";
import { AppointmentsTable } from "../components/AppointmentsTable";
import { useAppointments } from "../useAppointments";

const emptyFilters: AppointmentFilterValues = {
  search: "",
  status: "TODOS",
  terminal: "",
  date: "",
};

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export function AppointmentsPage() {
  const { appointments, isLoading, error, updateAppointmentStatus } = useAppointments();
  const location = useLocation();
  const [filters, setFilters] = useState<AppointmentFilterValues>(emptyFilters);
  const createdId = (location.state as { createdId?: string } | null)?.createdId;

  const filteredAppointments = useMemo(() => {
    const term = normalize(filters.search.trim());

    return appointments.filter((appointment) => {
      const searchable = normalize([
        appointment.id,
        appointment.vehiclePlate,
        appointment.driver,
        appointment.carrier,
      ].join(" "));

      return (!term || searchable.includes(term))
        && (filters.status === "TODOS" || appointment.status === filters.status)
        && (!filters.terminal || appointment.terminal === filters.terminal)
        && (!filters.date || appointment.scheduledDate === filters.date);
    });
  }, [appointments, filters]);

  return (
    <section className="appointments-page">
      <div className="appointments-page-heading">
        <div>
          <span>AGENDA PORTUÁRIA</span>
          <h2>Gestão de agendamentos</h2>
          <p>Consulte, filtre e acompanhe cada janela operacional em um único lugar.</p>
        </div>
        <Link className="primary-action" to="/agendamentos/novo"><Plus size={17} /> Novo agendamento</Link>
      </div>

      {createdId && <div className="appointment-success"><CalendarDays size={18} /><p>Agendamento <strong>{createdId}</strong> criado com sucesso.</p></div>}
      {isLoading && <div className="api-state-banner">Carregando agendamentos da API...</div>}
      {error && <div className="api-state-banner is-error">{error}</div>}

      <div className="appointments-list-card">
        <div className="appointment-summary">
          <div><CalendarDays size={18} /><span>Agendamentos encontrados</span></div>
          <strong>{filteredAppointments.length}</strong>
        </div>
        <AppointmentFilters filters={filters} onChange={setFilters} onClear={() => setFilters(emptyFilters)} />
        <AppointmentsTable appointments={filteredAppointments} onStatusChange={(id, status) => { void updateAppointmentStatus(id, status); }} onClearFilters={() => setFilters(emptyFilters)} />
      </div>
    </section>
  );
}
