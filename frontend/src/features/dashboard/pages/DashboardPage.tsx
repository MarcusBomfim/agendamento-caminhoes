import { Download, Plus } from "lucide-react";
import { Link } from "react-router";
import { useAppointments } from "../../appointments/useAppointments";
import { useRegistry } from "../../registries/useRegistry";
import { AlertsPanel } from "../components/AlertsPanel";
import { CapacityPanel } from "../components/CapacityPanel";
import { StatCard } from "../components/StatCard";
import { StatusPanel } from "../components/StatusPanel";
import { UpcomingAppointments } from "../components/UpcomingAppointments";
import type { DashboardStat, StatusSummary, TerminalCapacity, UpcomingAppointment } from "../types";

export function DashboardPage() {
  const { appointments, isLoading } = useAppointments();
  const { terminals } = useRegistry();
  const today = new Date().toISOString().slice(0, 10);
  const todayAppointments = appointments.filter((item) => item.scheduledDate === today);
  const count = (status: string) => todayAppointments.filter((item) => item.status === status).length;

  const stats: DashboardStat[] = [
    { label: "Agendamentos hoje", value: todayAppointments.length, helper: "Janelas registradas na API", variation: "Hoje", icon: "calendar", tone: "blue" },
    { label: "Caminhões no pátio", value: count("EM_PÁTIO"), helper: "Operações em atendimento", variation: "Agora", icon: "truck", tone: "teal" },
    { label: "Operações concluídas", value: count("CONCLUÍDO"), helper: "Finalizadas no dia", variation: "Hoje", icon: "completed", tone: "green" },
    { label: "Atrasos identificados", value: count("ATRASADO"), helper: "Necessitam acompanhamento", variation: "Atenção", icon: "warning", tone: "orange" },
  ];
  const capacities: TerminalCapacity[] = terminals.map((terminal) => ({ name: terminal.name, location: terminal.location, scheduled: todayAppointments.filter((item) => item.terminal === terminal.name).length, capacity: terminal.hourlyCapacity }));
  const statuses: StatusSummary[] = [
    { label: "Confirmados", value: count("CONFIRMADO"), color: "#1474b8" },
    { label: "Em pátio", value: count("EM_PÁTIO"), color: "#2a9d8f" },
    { label: "Concluídos", value: count("CONCLUÍDO"), color: "#2e9d69" },
    { label: "Atrasados", value: count("ATRASADO"), color: "#e08a32" },
  ];
  const upcoming: UpcomingAppointment[] = appointments.filter((item) => !["CONCLUÍDO", "CANCELADO"].includes(item.status)).slice(0, 5).map((item) => ({ id: item.id, time: item.scheduledTime, carrier: item.carrier, driver: item.driver, plate: item.vehiclePlate, terminal: item.terminal, operation: item.operation === "IMPORTAÇÃO" ? "Importação" : "Exportação", status: item.status === "EM_PÁTIO" ? "EM PÁTIO" : item.status }));

  return <section className="dashboard-page">
    <div className="dashboard-intro"><div><span>CONTROLE OPERACIONAL</span><h2>Operação de hoje</h2><p>Acompanhe o fluxo de caminhões, as janelas disponíveis e os pontos de atenção.</p></div><div className="dashboard-actions"><button type="button" className="secondary-action"><Download size={17} /> Exportar relatório</button><Link className="primary-action" to="/agendamentos/novo"><Plus size={18} /> Novo agendamento</Link></div></div>
    <div className="demo-notice"><span>{isLoading ? "Sincronizando" : "API integrada"}</span><p>{isLoading ? "Carregando os dados operacionais..." : "Informações atualizadas pelo serviço do Porto Agenda."}</p></div>
    <div className="stats-grid">{stats.map((stat) => <StatCard stat={stat} key={stat.label} />)}</div>
    <div className="dashboard-grid"><CapacityPanel terminalCapacities={capacities} /><StatusPanel statusSummary={statuses} /></div>
    <div className="dashboard-grid dashboard-grid-bottom"><UpcomingAppointments upcomingAppointments={upcoming} /><AlertsPanel /></div>
  </section>;
}
