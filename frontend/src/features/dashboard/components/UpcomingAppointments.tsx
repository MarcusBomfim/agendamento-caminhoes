import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { upcomingAppointments } from "../data";

function statusClass(status: string): string {
  return status.toLowerCase().replace(" ", "-").replace("á", "a");
}

export function UpcomingAppointments() {
  return (
    <section className="dashboard-panel appointments-panel" aria-labelledby="upcoming-title">
      <header className="panel-heading"><div><span>PRÓXIMAS JANELAS</span><h3 id="upcoming-title">Agendamentos programados</h3></div><Link to="/agendamentos">Ver agenda completa <ArrowRight size={16} /></Link></header>
      <div className="table-scroll">
        <table className="appointments-table">
          <caption className="sr-only">Próximos agendamentos portuários</caption>
          <thead><tr><th>Horário</th><th>Transportadora e motorista</th><th>Veículo</th><th>Terminal</th><th>Operação</th><th>Status</th></tr></thead>
          <tbody>{upcomingAppointments.map((appointment) => <tr key={appointment.id}><td><strong className="appointment-time">{appointment.time}</strong><small>{appointment.id}</small></td><td><strong>{appointment.carrier}</strong><small>{appointment.driver}</small></td><td><strong>{appointment.plate}</strong></td><td>{appointment.terminal}</td><td>{appointment.operation}</td><td><span className={`status-badge status-${statusClass(appointment.status)}`}>{appointment.status}</span></td></tr>)}</tbody>
        </table>
      </div>
    </section>
  );
}

