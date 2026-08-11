import { ArrowUpRight } from "lucide-react";
import type { TerminalCapacity } from "../types";

export function CapacityPanel({ terminalCapacities }: { terminalCapacities: TerminalCapacity[] }) {
  return (
    <section className="dashboard-panel capacity-panel" aria-labelledby="capacity-title">
      <header className="panel-heading"><div><span>OCUPAÇÃO PROGRAMADA</span><h3 id="capacity-title">Capacidade por terminal</h3></div><button type="button" aria-label="Abrir capacidade detalhada"><ArrowUpRight size={18} /></button></header>
      <div className="capacity-list">
        {terminalCapacities.map((terminal) => {
          const percentage = terminal.capacity ? Math.min(100, Math.round((terminal.scheduled / terminal.capacity) * 100)) : 0;
          return (
            <div className="capacity-item" key={terminal.name}>
              <div className="capacity-description"><div><strong>{terminal.name}</strong><span>{terminal.location}</span></div><p><b>{terminal.scheduled}</b> / {terminal.capacity}<small>{percentage}%</small></p></div>
              <div className="capacity-track" role="progressbar" aria-label={`Ocupação do ${terminal.name}`} aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${percentage}%` }} /></div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
