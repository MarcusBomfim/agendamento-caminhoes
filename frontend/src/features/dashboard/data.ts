import type {
  DashboardStat,
  OperationAlert,
  StatusSummary,
  TerminalCapacity,
  UpcomingAppointment,
} from "./types";

export const dashboardStats: DashboardStat[] = [
  { label: "Agendamentos hoje", value: 48, helper: "8 nas próximas 2 horas", variation: "+12%", icon: "calendar", tone: "blue" },
  { label: "Caminhões no pátio", value: 12, helper: "Capacidade atual de 40%", variation: "+3", icon: "truck", tone: "teal" },
  { label: "Operações concluídas", value: 27, helper: "Tempo médio de 42 minutos", variation: "+8%", icon: "completed", tone: "green" },
  { label: "Atrasos identificados", value: 3, helper: "Necessitam acompanhamento", variation: "-2", icon: "warning", tone: "orange" },
];

export const terminalCapacities: TerminalCapacity[] = [
  { name: "Terminal Atlântico", location: "Margem direita", scheduled: 32, capacity: 40 },
  { name: "Pátio Alemoa", location: "Zona industrial", scheduled: 18, capacity: 30 },
  { name: "Terminal Guarujá", location: "Margem esquerda", scheduled: 14, capacity: 25 },
];

export const statusSummary: StatusSummary[] = [
  { label: "Confirmados", value: 19, color: "#1474b8" },
  { label: "Em pátio", value: 12, color: "#2a9d8f" },
  { label: "Concluídos", value: 14, color: "#2e9d69" },
  { label: "Atrasados", value: 3, color: "#e08a32" },
];

export const upcomingAppointments: UpcomingAppointment[] = [
  { id: "PA-260810-048", time: "10:30", carrier: "Rota Litoral", driver: "Carlos Mendes", plate: "BRA2E19", terminal: "Terminal Atlântico", operation: "Importação", status: "CONFIRMADO" },
  { id: "PA-260810-049", time: "10:50", carrier: "Transmar Logística", driver: "Marina Souza", plate: "FRT7A42", terminal: "Pátio Alemoa", operation: "Exportação", status: "EM PÁTIO" },
  { id: "PA-260810-050", time: "11:10", carrier: "Costa Transportes", driver: "Paulo Ribeiro", plate: "GHT4B88", terminal: "Terminal Guarujá", operation: "Importação", status: "ATRASADO" },
  { id: "PA-260810-051", time: "11:30", carrier: "Eixo Sul Cargas", driver: "André Lima", plate: "KPL9C31", terminal: "Terminal Atlântico", operation: "Exportação", status: "AGUARDANDO" },
  { id: "PA-260810-052", time: "11:50", carrier: "Navega Log", driver: "Juliana Alves", plate: "QWE5D70", terminal: "Pátio Alemoa", operation: "Importação", status: "CONFIRMADO" },
];

export const operationAlerts: OperationAlert[] = [
  { id: 1, title: "Capacidade próxima do limite", description: "Terminal Atlântico atingiu 80% das janelas disponíveis.", time: "Há 6 min", tone: "warning" },
  { id: 2, title: "Veículo aguardando liberação", description: "O veículo FRT7A42 realizou check-in no Pátio Alemoa.", time: "Há 12 min", tone: "info" },
  { id: 3, title: "Operação finalizada", description: "O agendamento PA-260810-044 foi concluído sem ocorrências.", time: "Há 18 min", tone: "success" },
];

