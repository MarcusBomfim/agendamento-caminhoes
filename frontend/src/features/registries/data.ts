import type { Driver, Terminal, Vehicle } from "./types";

export const initialDrivers: Driver[] = [
  { id: "MOT-001", name: "Carlos Mendes", cpf: "***.482.***-11", cnh: "04829163740", cnhCategory: "E", cnhExpiresAt: "2028-03-18", phone: "(13) 99724-1840", carrier: "Rota Litoral", status: "ATIVO" },
  { id: "MOT-002", name: "Marina Souza", cpf: "***.725.***-06", cnh: "06472819351", cnhCategory: "E", cnhExpiresAt: "2027-11-05", phone: "(13) 98851-7204", carrier: "Transmar Logística", status: "ATIVO" },
  { id: "MOT-003", name: "Paulo Ribeiro", cpf: "***.193.***-42", cnh: "05736182940", cnhCategory: "D", cnhExpiresAt: "2026-09-22", phone: "(11) 97642-3195", carrier: "Costa Transportes", status: "BLOQUEADO" },
  { id: "MOT-004", name: "André Lima", cpf: "***.914.***-28", cnh: "07361529482", cnhCategory: "E", cnhExpiresAt: "2029-01-14", phone: "(13) 99102-8843", carrier: "Eixo Sul Cargas", status: "ATIVO" },
  { id: "MOT-005", name: "Juliana Alves", cpf: "***.356.***-70", cnh: "05928471630", cnhCategory: "D", cnhExpiresAt: "2027-06-30", phone: "(13) 99617-4521", carrier: "Navega Log", status: "INATIVO" },
];

export const initialVehicles: Vehicle[] = [
  { id: "VEI-001", plate: "BRA2E19", type: "Cavalo mecânico", model: "Volvo FH 540", carrier: "Rota Litoral", renavam: "01482936175", capacityTons: 45, status: "DISPONÍVEL" },
  { id: "VEI-002", plate: "FRT7A42", type: "Carreta LS", model: "Scania R450", carrier: "Transmar Logística", renavam: "01372649580", capacityTons: 48, status: "EM_OPERAÇÃO" },
  { id: "VEI-003", plate: "GHT4B88", type: "Porta-contêiner", model: "Mercedes Actros", carrier: "Costa Transportes", renavam: "01263847591", capacityTons: 42, status: "MANUTENÇÃO" },
  { id: "VEI-004", plate: "KPL9C31", type: "Cavalo mecânico", model: "DAF XF 530", carrier: "Eixo Sul Cargas", renavam: "01583726409", capacityTons: 46, status: "DISPONÍVEL" },
  { id: "VEI-005", plate: "QWE5D70", type: "Carreta baú", model: "Iveco S-Way", carrier: "Navega Log", renavam: "01192837465", capacityTons: 40, status: "INATIVO" },
];

export const initialTerminals: Terminal[] = [
  { id: "TER-001", name: "Terminal Atlântico", code: "TATL", location: "Margem Direita — Santos", gates: 4, openingTime: "06:00", closingTime: "23:00", hourlyCapacity: 18, status: "OPERACIONAL" },
  { id: "TER-002", name: "Pátio Alemoa", code: "PALE", location: "Alemoa — Santos", gates: 3, openingTime: "05:00", closingTime: "22:00", hourlyCapacity: 14, status: "OPERACIONAL" },
  { id: "TER-003", name: "Terminal Guarujá", code: "TGUA", location: "Margem Esquerda — Guarujá", gates: 2, openingTime: "07:00", closingTime: "21:00", hourlyCapacity: 10, status: "RESTRITO" },
];
