import type { StatusSummary } from "../types";

export function StatusPanel({ statusSummary }: { statusSummary: StatusSummary[] }) {
  const total = statusSummary.reduce((sum, status) => sum + status.value, 0);
  let accumulatedPercentage = 0;
  const chartSegments = statusSummary.map((status) => {
    const segmentStart = accumulatedPercentage;
    accumulatedPercentage += total > 0 ? (status.value / total) * 100 : 0;
    return `${status.color} ${segmentStart}% ${accumulatedPercentage}%`;
  });
  const chartBackground = total > 0 ? `conic-gradient(${chartSegments.join(", ")})` : "#eaf0f4";

  return (
    <section className="dashboard-panel status-panel" aria-labelledby="status-title">
      <header className="panel-heading"><div><span>FLUXO DE HOJE</span><h3 id="status-title">Situação dos agendamentos</h3></div></header>
      <div className="status-content">
        <div className="status-chart" style={{ background: chartBackground }} role="img" aria-label={`Total de ${total} agendamentos`}><div><strong>{total}</strong><span>Total</span></div></div>
        <ul>{statusSummary.map((status) => <li key={status.label}><i style={{ backgroundColor: status.color }} /><span>{status.label}</span><strong>{status.value}</strong></li>)}</ul>
      </div>
    </section>
  );
}
