import type { OperationAlert } from "./types";

export const operationAlerts: OperationAlert[] = [
  { id: 1, title: "Capacidade próxima do limite", description: "O Terminal Saboó está com alta concentração de janelas no período da manhã.", time: "Há 6 min", tone: "warning" },
  { id: 2, title: "Veículo aguardando liberação", description: "O veículo FRT7A42 realizou check-in no Pátio Alemoa.", time: "Há 12 min", tone: "info" },
  { id: 3, title: "Agendamento em atraso", description: "O agendamento PA-DEMO-105 ainda não registrou entrada no Pátio Cubatão.", time: "Há 16 min", tone: "warning" },
  { id: 4, title: "Operação finalizada", description: "O agendamento PA-DEMO-102 foi concluído sem ocorrências.", time: "Há 18 min", tone: "success" },
  { id: 5, title: "Terminal com restrição", description: "O Terminal Conceiçãozinha opera com capacidade reduzida.", time: "Há 24 min", tone: "info" },
];
