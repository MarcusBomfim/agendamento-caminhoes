import type { Driver, DriverStatus, NewDriver, NewTerminal, NewVehicle, Terminal, TerminalStatus, Vehicle, VehicleStatus } from "./registry.types.ts";

const drivers: Driver[] = [
  { id: "MOT-001", name: "Carlos Mendes", cpf: "***.482.***-11", cnh: "04829163740", cnhCategory: "E", cnhExpiresAt: "2028-03-18", phone: "(13) 99724-1840", carrier: "Rota Litoral", status: "ATIVO" },
  { id: "MOT-002", name: "Marina Souza", cpf: "***.725.***-06", cnh: "06472819351", cnhCategory: "E", cnhExpiresAt: "2027-11-05", phone: "(13) 98851-7204", carrier: "Transmar Logística", status: "ATIVO" },
  { id: "MOT-003", name: "Paulo Ribeiro", cpf: "***.193.***-42", cnh: "05736182940", cnhCategory: "D", cnhExpiresAt: "2026-09-22", phone: "(11) 97642-3195", carrier: "Costa Transportes", status: "BLOQUEADO" },
];

const vehicles: Vehicle[] = [
  { id: "VEI-001", plate: "BRA2E19", type: "Cavalo mecânico", model: "Volvo FH 540", carrier: "Rota Litoral", renavam: "01482936175", capacityTons: 45, status: "DISPONÍVEL" },
  { id: "VEI-002", plate: "FRT7A42", type: "Carreta LS", model: "Scania R450", carrier: "Transmar Logística", renavam: "01372649580", capacityTons: 48, status: "EM_OPERAÇÃO" },
  { id: "VEI-003", plate: "GHT4B88", type: "Porta-contêiner", model: "Mercedes Actros", carrier: "Costa Transportes", renavam: "01263847591", capacityTons: 42, status: "MANUTENÇÃO" },
];

const terminals: Terminal[] = [
  { id: "TER-001", name: "Terminal Atlântico", code: "TATL", location: "Margem Direita — Santos", gates: 4, openingTime: "06:00", closingTime: "23:00", hourlyCapacity: 18, status: "OPERACIONAL" },
  { id: "TER-002", name: "Pátio Alemoa", code: "PALE", location: "Alemoa — Santos", gates: 3, openingTime: "05:00", closingTime: "22:00", hourlyCapacity: 14, status: "OPERACIONAL" },
  { id: "TER-003", name: "Terminal Guarujá", code: "TGUA", location: "Margem Esquerda — Guarujá", gates: 2, openingTime: "07:00", closingTime: "21:00", hourlyCapacity: 10, status: "RESTRITO" },
];

export class RegistryRepository {
  listDrivers() { return [...drivers]; }
  listVehicles() { return [...vehicles]; }
  listTerminals() { return [...terminals]; }
  findDriver(id: string) { return drivers.find((item) => item.id === id); }
  findDriverByName(name: string) { return drivers.find((item) => item.name.toLowerCase() === name.toLowerCase()); }
  findVehicle(id: string) { return vehicles.find((item) => item.id === id); }
  findVehicleByPlate(plate: string) { return vehicles.find((item) => item.plate === plate.toUpperCase()); }
  findTerminal(id: string) { return terminals.find((item) => item.id === id); }
  findTerminalByName(name: string) { return terminals.find((item) => item.name.toLowerCase() === name.toLowerCase()); }

  createDriver(id: string, input: NewDriver) { const item: Driver = { id, ...input, status: "ATIVO" }; drivers.unshift(item); return item; }
  createVehicle(id: string, input: NewVehicle) { const item: Vehicle = { id, ...input, status: "DISPONÍVEL" }; vehicles.unshift(item); return item; }
  createTerminal(id: string, input: NewTerminal) { const item: Terminal = { id, ...input, status: "OPERACIONAL" }; terminals.unshift(item); return item; }

  updateDriverStatus(id: string, status: DriverStatus) { const item = this.findDriver(id); if (item) item.status = status; return item; }
  updateVehicleStatus(id: string, status: VehicleStatus) { const item = this.findVehicle(id); if (item) item.status = status; return item; }
  updateTerminalStatus(id: string, status: TerminalStatus) { const item = this.findTerminal(id); if (item) item.status = status; return item; }
}

export const registryRepository = new RegistryRepository();
