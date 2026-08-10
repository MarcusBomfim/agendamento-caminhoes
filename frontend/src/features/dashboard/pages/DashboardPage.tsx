import { Download, Plus } from "lucide-react";
import { Link } from "react-router";
import { AlertsPanel } from "../components/AlertsPanel";
import { CapacityPanel } from "../components/CapacityPanel";
import { StatCard } from "../components/StatCard";
import { StatusPanel } from "../components/StatusPanel";
import { UpcomingAppointments } from "../components/UpcomingAppointments";
import { dashboardStats } from "../data";

export function DashboardPage() {
  return (
    <section className="dashboard-page">
      <div className="dashboard-intro">
        <div><span>CONTROLE OPERACIONAL</span><h2>Operação de hoje</h2><p>Acompanhe o fluxo de caminhões, as janelas disponíveis e os pontos de atenção.</p></div>
        <div className="dashboard-actions"><button type="button" className="secondary-action"><Download size={17} /> Exportar relatório</button><Link className="primary-action" to="/agendamentos/novo"><Plus size={18} /> Novo agendamento</Link></div>
      </div>
      <div className="demo-notice"><span>Dados de demonstração</span><p>As informações serão integradas à API nas próximas etapas.</p></div>
      <div className="stats-grid">{dashboardStats.map((stat) => <StatCard stat={stat} key={stat.label} />)}</div>
      <div className="dashboard-grid"><CapacityPanel /><StatusPanel /></div>
      <div className="dashboard-grid dashboard-grid-bottom"><UpcomingAppointments /><AlertsPanel /></div>
    </section>
  );
}

