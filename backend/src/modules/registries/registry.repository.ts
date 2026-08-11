import { databaseEnabled, query } from "../../database/client.ts";
import type { Driver, DriverStatus, NewDriver, NewTerminal, NewVehicle, Terminal, TerminalStatus, Vehicle, VehicleStatus } from "./registry.types.ts";

const drivers: Driver[] = [
  { id: "MOT-001", name: "Carlos Mendes", cpf: "48200000011", cnh: "04829163740", cnhCategory: "E", cnhExpiresAt: "2028-03-18", phone: "(13) 99724-1840", carrier: "Rota Litoral", status: "ATIVO" },
  { id: "MOT-002", name: "Marina Souza", cpf: "72500000006", cnh: "06472819351", cnhCategory: "E", cnhExpiresAt: "2027-11-05", phone: "(13) 98851-7204", carrier: "Transmar Logística", status: "ATIVO" },
  { id: "MOT-003", name: "Paulo Ribeiro", cpf: "19300000042", cnh: "05736182940", cnhCategory: "D", cnhExpiresAt: "2026-09-22", phone: "(11) 97642-3195", carrier: "Costa Transportes", status: "BLOQUEADO" },
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

interface DriverRow { id: string; name: string; cpf: string; cnh: string; cnh_category: "D" | "E"; cnh_expires_at: string; phone: string; carrier: string; status: DriverStatus }
interface VehicleRow { id: string; plate: string; type: string; model: string; carrier: string; renavam: string; capacity_tons: string; status: VehicleStatus }
interface TerminalRow { id: string; name: string; code: string; location: string; gates: number; opening_time: string; closing_time: string; hourly_capacity: number; status: TerminalStatus }

const mapDriver = (row: DriverRow): Driver => ({ id: row.id, name: row.name, cpf: row.cpf, cnh: row.cnh, cnhCategory: row.cnh_category, cnhExpiresAt: row.cnh_expires_at, phone: row.phone, carrier: row.carrier, status: row.status });
const mapVehicle = (row: VehicleRow): Vehicle => ({ id: row.id, plate: row.plate, type: row.type, model: row.model, carrier: row.carrier, renavam: row.renavam, capacityTons: Number(row.capacity_tons), status: row.status });
const mapTerminal = (row: TerminalRow): Terminal => ({ id: row.id, name: row.name, code: row.code, location: row.location, gates: row.gates, openingTime: row.opening_time.slice(0, 5), closingTime: row.closing_time.slice(0, 5), hourlyCapacity: row.hourly_capacity, status: row.status });

export class RegistryRepository {
  async listDrivers() { if (!databaseEnabled) return [...drivers]; return (await query<DriverRow>("SELECT id, name, cpf, cnh, cnh_category, cnh_expires_at::text, phone, carrier, status FROM drivers ORDER BY created_at DESC")).rows.map(mapDriver); }
  async listVehicles() { if (!databaseEnabled) return [...vehicles]; return (await query<VehicleRow>("SELECT id, plate, type, model, carrier, renavam, capacity_tons, status FROM vehicles ORDER BY created_at DESC")).rows.map(mapVehicle); }
  async listTerminals() { if (!databaseEnabled) return [...terminals]; return (await query<TerminalRow>("SELECT id, name, code, location, gates, opening_time::text, closing_time::text, hourly_capacity, status FROM terminals ORDER BY created_at DESC")).rows.map(mapTerminal); }
  async findDriver(id: string) { if (!databaseEnabled) return drivers.find((item) => item.id === id); const row = (await query<DriverRow>("SELECT id, name, cpf, cnh, cnh_category, cnh_expires_at::text, phone, carrier, status FROM drivers WHERE id = $1", [id])).rows[0]; return row ? mapDriver(row) : undefined; }
  async findVehicle(id: string) { if (!databaseEnabled) return vehicles.find((item) => item.id === id); const row = (await query<VehicleRow>("SELECT id, plate, type, model, carrier, renavam, capacity_tons, status FROM vehicles WHERE id = $1", [id])).rows[0]; return row ? mapVehicle(row) : undefined; }
  async findVehicleByPlate(plate: string) { if (!databaseEnabled) return vehicles.find((item) => item.plate === plate.toUpperCase()); const row = (await query<VehicleRow>("SELECT id, plate, type, model, carrier, renavam, capacity_tons, status FROM vehicles WHERE plate = $1", [plate.toUpperCase()])).rows[0]; return row ? mapVehicle(row) : undefined; }
  async findTerminal(id: string) { if (!databaseEnabled) return terminals.find((item) => item.id === id); const row = (await query<TerminalRow>("SELECT id, name, code, location, gates, opening_time::text, closing_time::text, hourly_capacity, status FROM terminals WHERE id = $1", [id])).rows[0]; return row ? mapTerminal(row) : undefined; }

  async createDriver(id: string, input: NewDriver) { if (!databaseEnabled) { const item: Driver = { id, ...input, status: "ATIVO" }; drivers.unshift(item); return item; } const row = (await query<DriverRow>("INSERT INTO drivers (id, name, cpf, cnh, cnh_category, cnh_expires_at, phone, carrier) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id, name, cpf, cnh, cnh_category, cnh_expires_at::text, phone, carrier, status", [id, input.name, input.cpf, input.cnh, input.cnhCategory, input.cnhExpiresAt, input.phone, input.carrier])).rows[0]; return mapDriver(row!); }
  async createVehicle(id: string, input: NewVehicle) { if (!databaseEnabled) { const item: Vehicle = { id, ...input, status: "DISPONÍVEL" }; vehicles.unshift(item); return item; } const row = (await query<VehicleRow>("INSERT INTO vehicles (id, plate, type, model, carrier, renavam, capacity_tons) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id, plate, type, model, carrier, renavam, capacity_tons, status", [id, input.plate, input.type, input.model, input.carrier, input.renavam, input.capacityTons])).rows[0]; return mapVehicle(row!); }
  async createTerminal(id: string, input: NewTerminal) { if (!databaseEnabled) { const item: Terminal = { id, ...input, status: "OPERACIONAL" }; terminals.unshift(item); return item; } const row = (await query<TerminalRow>("INSERT INTO terminals (id, name, code, location, gates, opening_time, closing_time, hourly_capacity) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id, name, code, location, gates, opening_time::text, closing_time::text, hourly_capacity, status", [id, input.name, input.code, input.location, input.gates, input.openingTime, input.closingTime, input.hourlyCapacity])).rows[0]; return mapTerminal(row!); }

  async updateDriverStatus(id: string, status: DriverStatus) { if (!databaseEnabled) { const item = drivers.find((entry) => entry.id === id); if (item) item.status = status; return item; } const row = (await query<DriverRow>("UPDATE drivers SET status=$2, updated_at=NOW() WHERE id=$1 RETURNING id, name, cpf, cnh, cnh_category, cnh_expires_at::text, phone, carrier, status", [id, status])).rows[0]; return row ? mapDriver(row) : undefined; }
  async updateVehicleStatus(id: string, status: VehicleStatus) { if (!databaseEnabled) { const item = vehicles.find((entry) => entry.id === id); if (item) item.status = status; return item; } const row = (await query<VehicleRow>("UPDATE vehicles SET status=$2, updated_at=NOW() WHERE id=$1 RETURNING id, plate, type, model, carrier, renavam, capacity_tons, status", [id, status])).rows[0]; return row ? mapVehicle(row) : undefined; }
  async updateTerminalStatus(id: string, status: TerminalStatus) { if (!databaseEnabled) { const item = terminals.find((entry) => entry.id === id); if (item) item.status = status; return item; } const row = (await query<TerminalRow>("UPDATE terminals SET status=$2, updated_at=NOW() WHERE id=$1 RETURNING id, name, code, location, gates, opening_time::text, closing_time::text, hourly_capacity, status", [id, status])).rows[0]; return row ? mapTerminal(row) : undefined; }
}

export const registryRepository = new RegistryRepository();
