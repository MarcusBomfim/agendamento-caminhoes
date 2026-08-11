import type { OperationAlert } from "./types";

export const operationAlerts: OperationAlert[] = [
  { id: 1, title: "Capacidade próxima do limite", description: "Terminal Atlântico atingiu 80% das janelas disponíveis.", time: "Há 6 min", tone: "warning" },
  { id: 2, title: "Veículo aguardando liberação", description: "O veículo FRT7A42 realizou check-in no Pátio Alemoa.", time: "Há 12 min", tone: "info" },
  { id: 3, title: "Operação finalizada", description: "O agendamento PA-260810-044 foi concluído sem ocorrências.", time: "Há 18 min", tone: "success" },
];
