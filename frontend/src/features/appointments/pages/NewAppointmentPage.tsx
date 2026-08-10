import { CalendarPlus } from "lucide-react";
import { ModulePlaceholder } from "../../../components/ui/ModulePlaceholder";

export function NewAppointmentPage() {
  return <ModulePlaceholder eyebrow="NOVA OPERAÇÃO" title="Agende a entrada de um caminhão" description="Informe transportadora, motorista, veículo, terminal e janela de atendimento." icon={CalendarPlus} />;
}

