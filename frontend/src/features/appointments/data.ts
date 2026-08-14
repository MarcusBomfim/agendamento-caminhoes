import type { Appointment } from "./types";

export const carrierOptions = [
  "Rota Litoral",
  "Transmar Logística",
  "Costa Transportes",
  "Eixo Sul Cargas",
  "Navega Log",
  "Atlas Rodoviário",
  "Baixada Cargas",
  "Porto Sul",
  "Santos Express",
];
export const driverOptions = ["Carlos Mendes", "Marina Souza", "Paulo Ribeiro", "André Lima", "Juliana Alves"];
export const vehicleOptions = ["BRA2E19", "FRT7A42", "GHT4B88", "KPL9C31", "QWE5D70"];
export const terminalOptions = [
  "Terminal Atlântico",
  "Pátio Alemoa",
  "Terminal Guarujá",
  "Terminal Saboó",
  "Pátio Cubatão",
  "Terminal Conceiçãozinha",
  "Base Logística Anchieta",
];
export const gateOptions = ["Portão 01", "Portão 02", "Portão 03", "Portão 04", "Portão 05", "Portão 06"];

export const initialAppointments: Appointment[] = [
  { id: "PA-260810-048", scheduledDate: "2026-08-10", scheduledTime: "10:30", estimatedMinutes: 45, carrier: "Rota Litoral", driver: "Carlos Mendes", vehiclePlate: "BRA2E19", terminal: "Terminal Atlântico", gate: "Portão 01", operation: "IMPORTAÇÃO", containerNumber: "MSCU1234567", status: "CONFIRMADO", notes: "", createdAt: "2026-08-09T15:20:00" },
  { id: "PA-260810-049", scheduledDate: "2026-08-10", scheduledTime: "10:50", estimatedMinutes: 45, carrier: "Transmar Logística", driver: "Marina Souza", vehiclePlate: "FRT7A42", terminal: "Pátio Alemoa", gate: "Portão 03", operation: "EXPORTAÇÃO", containerNumber: "TCLU7654321", status: "EM_PÁTIO", notes: "Prioridade operacional", createdAt: "2026-08-09T16:10:00" },
  { id: "PA-260810-050", scheduledDate: "2026-08-10", scheduledTime: "11:10", estimatedMinutes: 60, carrier: "Costa Transportes", driver: "Paulo Ribeiro", vehiclePlate: "GHT4B88", terminal: "Terminal Guarujá", gate: "Portão 02", operation: "IMPORTAÇÃO", containerNumber: "CMAU2468135", status: "ATRASADO", notes: "", createdAt: "2026-08-09T17:05:00" },
  { id: "PA-260810-051", scheduledDate: "2026-08-10", scheduledTime: "11:30", estimatedMinutes: 30, carrier: "Eixo Sul Cargas", driver: "André Lima", vehiclePlate: "KPL9C31", terminal: "Terminal Atlântico", gate: "Portão 04", operation: "EXPORTAÇÃO", containerNumber: "", status: "PENDENTE", notes: "Carga solta", createdAt: "2026-08-09T17:40:00" },
  { id: "PA-260810-052", scheduledDate: "2026-08-10", scheduledTime: "11:50", estimatedMinutes: 45, carrier: "Navega Log", driver: "Juliana Alves", vehiclePlate: "QWE5D70", terminal: "Pátio Alemoa", gate: "Portão 01", operation: "IMPORTAÇÃO", containerNumber: "MEDU9753186", status: "CONFIRMADO", notes: "", createdAt: "2026-08-09T18:15:00" },
  { id: "PA-260810-053", scheduledDate: "2026-08-10", scheduledTime: "12:20", estimatedMinutes: 60, carrier: "Rota Litoral", driver: "Carlos Mendes", vehiclePlate: "BRA2E19", terminal: "Terminal Guarujá", gate: "Portão 02", operation: "EXPORTAÇÃO", containerNumber: "MSCU1122334", status: "CANCELADO", notes: "Cancelado pela transportadora", createdAt: "2026-08-09T19:00:00" },
  { id: "PA-260809-043", scheduledDate: "2026-08-09", scheduledTime: "16:00", estimatedMinutes: 45, carrier: "Transmar Logística", driver: "Marina Souza", vehiclePlate: "FRT7A42", terminal: "Terminal Atlântico", gate: "Portão 01", operation: "IMPORTAÇÃO", containerNumber: "TCLU9988776", status: "CONCLUÍDO", notes: "", createdAt: "2026-08-08T12:00:00" },
];
