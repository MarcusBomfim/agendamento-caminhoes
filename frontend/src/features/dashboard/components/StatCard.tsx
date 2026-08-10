import { CalendarCheck2, CheckCircle2, TriangleAlert, Truck, type LucideIcon } from "lucide-react";
import type { DashboardStat, StatIconName } from "../types";

const statIcons: Record<StatIconName, LucideIcon> = {
  calendar: CalendarCheck2,
  truck: Truck,
  completed: CheckCircle2,
  warning: TriangleAlert,
};

export function StatCard({ stat }: { stat: DashboardStat }) {
  const Icon = statIcons[stat.icon];

  return (
    <article className={`stat-card stat-${stat.tone}`}>
      <div className="stat-card-top"><span className="stat-icon"><Icon size={20} /></span><span className="stat-variation">{stat.variation}</span></div>
      <span className="stat-label">{stat.label}</span>
      <strong>{stat.value}</strong>
      <p>{stat.helper}</p>
    </article>
  );
}

