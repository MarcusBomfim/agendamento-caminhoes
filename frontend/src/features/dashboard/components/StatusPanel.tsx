import { statusSummary } from "../data";

export function StatusPanel() {
  const total = statusSummary.reduce((sum, status) => sum + status.value, 0);

  return (
    <section className="dashboard-panel status-panel" aria-labelledby="status-title">
      <header className="panel-heading"><div><span>FLUXO DE HOJE</span><h3 id="status-title">Situação dos agendamentos</h3></div></header>
      <div className="status-content">
        <div className="status-chart" role="img" aria-label={`Total de ${total} agendamentos`}><div><strong>{total}</strong><span>Total</span></div></div>
        <ul>{statusSummary.map((status) => <li key={status.label}><i style={{ backgroundColor: status.color }} /><span>{status.label}</span><strong>{status.value}</strong></li>)}</ul>
      </div>
    </section>
  );
}

