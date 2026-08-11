import { AppError } from "../../shared/errors/AppError.ts";
import { createId } from "../../shared/utils/createId.ts";
import { registryRepository } from "./registry.repository.ts";
import type { DriverStatus, NewDriver, NewTerminal, NewVehicle, TerminalStatus, VehicleStatus } from "./registry.types.ts";

export class RegistryService {
  listDrivers() { return registryRepository.listDrivers(); }
  listVehicles() { return registryRepository.listVehicles(); }
  listTerminals() { return registryRepository.listTerminals(); }
  async createDriver(input: NewDriver) { if ((await registryRepository.listDrivers()).some((item) => item.cpf === input.cpf || item.cnh === input.cnh)) throw new AppError(409, "CPF ou CNH já cadastrado"); return registryRepository.createDriver(createId("MOT"), input); }
  async createVehicle(input: NewVehicle) { if (await registryRepository.findVehicleByPlate(input.plate) || (await registryRepository.listVehicles()).some((item) => item.renavam === input.renavam)) throw new AppError(409, "Placa ou RENAVAM já cadastrado"); return registryRepository.createVehicle(createId("VEI"), input); }
  async createTerminal(input: NewTerminal) { if ((await registryRepository.listTerminals()).some((item) => item.code === input.code)) throw new AppError(409, "Código de terminal já cadastrado"); if (input.openingTime >= input.closingTime) throw new AppError(422, "O fechamento deve ocorrer depois da abertura"); return registryRepository.createTerminal(createId("TER"), input); }
  async updateDriverStatus(id: string, status: DriverStatus) { const item = await registryRepository.updateDriverStatus(id, status); if (!item) throw new AppError(404, "Motorista não encontrado"); return item; }
  async updateVehicleStatus(id: string, status: VehicleStatus) { const item = await registryRepository.updateVehicleStatus(id, status); if (!item) throw new AppError(404, "Veículo não encontrado"); return item; }
  async updateTerminalStatus(id: string, status: TerminalStatus) { const item = await registryRepository.updateTerminalStatus(id, status); if (!item) throw new AppError(404, "Terminal não encontrado"); return item; }
}

export const registryService = new RegistryService();
