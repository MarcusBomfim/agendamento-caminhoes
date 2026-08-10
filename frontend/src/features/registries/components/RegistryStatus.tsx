const statusClass: Record<string, string> = {
  ATIVO: "success",
  DISPONÍVEL: "success",
  OPERACIONAL: "success",
  EM_OPERAÇÃO: "info",
  RESTRITO: "warning",
  MANUTENÇÃO: "warning",
  BLOQUEADO: "danger",
  INATIVO: "neutral",
};

export function RegistryStatus({ status }: { status: string }) {
  return <span className={`registry-status registry-status-${statusClass[status] ?? "neutral"}`}><i />{status.replace("_", " ").toLowerCase()}</span>;
}
