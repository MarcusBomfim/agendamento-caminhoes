import { FilterX, Search } from "lucide-react";
import { terminalOptions } from "../data";
import type { AppointmentStatus } from "../types";

export interface AppointmentFilterValues {
  search: string;
  status: AppointmentStatus | "TODOS";
  terminal: string;
  date: string;
}

interface AppointmentFiltersProps {
  filters: AppointmentFilterValues;
  onChange: (filters: AppointmentFilterValues) => void;
  onClear: () => void;
}

export function AppointmentFilters({ filters, onChange, onClear }: AppointmentFiltersProps) {
  const update = <Key extends keyof AppointmentFilterValues>(key: Key, value: AppointmentFilterValues[Key]) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="appointment-filters">
      <label className="search-field"><span className="sr-only">Pesquisar agendamentos</span><Search size={17} /><input value={filters.search} onChange={(event) => update("search", event.target.value)} placeholder="Código, placa, motorista ou transportadora" /></label>
      <label><span className="sr-only">Filtrar por status</span><select value={filters.status} onChange={(event) => update("status", event.target.value as AppointmentFilterValues["status"])}><option value="TODOS">Todos os status</option><option value="PENDENTE">Pendente</option><option value="CONFIRMADO">Confirmado</option><option value="EM_PÁTIO">Em pátio</option><option value="CONCLUÍDO">Concluído</option><option value="ATRASADO">Atrasado</option><option value="CANCELADO">Cancelado</option></select></label>
      <label><span className="sr-only">Filtrar por terminal</span><select value={filters.terminal} onChange={(event) => update("terminal", event.target.value)}><option value="">Todos os terminais</option>{terminalOptions.map((terminal) => <option key={terminal}>{terminal}</option>)}</select></label>
      <label><span className="sr-only">Filtrar por data</span><input type="date" value={filters.date} onChange={(event) => update("date", event.target.value)} /></label>
      <button className="clear-filters" type="button" onClick={onClear} title="Limpar filtros"><FilterX size={17} /><span>Limpar</span></button>
    </div>
  );
}

