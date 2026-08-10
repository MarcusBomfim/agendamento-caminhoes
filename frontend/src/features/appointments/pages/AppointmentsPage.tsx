import { CalendarDays } from "lucide-react";
import { ModulePlaceholder } from "../../../components/ui/ModulePlaceholder";

export function AppointmentsPage() {
  return <ModulePlaceholder eyebrow="AGENDA PORTUÁRIA" title="Gerencie os agendamentos" description="Consulte solicitações, horários confirmados, atrasos e operações finalizadas." icon={CalendarDays} />;
}

