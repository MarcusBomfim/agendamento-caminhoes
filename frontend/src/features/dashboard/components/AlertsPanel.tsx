import { CheckCircle2, Clock3, Info, TriangleAlert, type LucideIcon } from "lucide-react";
import { operationAlerts } from "../data";
import type { AlertTone } from "../types";

const alertIcons: Record<AlertTone, LucideIcon> = { warning: TriangleAlert, info: Info, success: CheckCircle2 };

export function AlertsPanel() {
  return (
    <section className="dashboard-panel alerts-panel" aria-labelledby="alerts-title">
      <header className="panel-heading"><div><span>ATUALIZAÇÕES</span><h3 id="alerts-title">Alertas operacionais</h3></div><span className="alert-count">{operationAlerts.length}</span></header>
      <div className="alerts-list">{operationAlerts.map((alert) => { const Icon = alertIcons[alert.tone]; return <article className={`alert-item alert-${alert.tone}`} key={alert.id}><span className="alert-icon"><Icon size={18} /></span><div><strong>{alert.title}</strong><p>{alert.description}</p><small><Clock3 size={12} /> {alert.time}</small></div></article>; })}</div>
    </section>
  );
}

