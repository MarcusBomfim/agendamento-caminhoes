export type DriverStatus = "ATIVO" | "INATIVO" | "BLOQUEADO";
export type VehicleStatus = "DISPONÍVEL" | "EM_OPERAÇÃO" | "MANUTENÇÃO" | "INATIVO";
export type TerminalStatus = "OPERACIONAL" | "RESTRITO" | "INATIVO";

export interface Driver {
  id: string;
  name: string;
  cpf: string;
  cnh: string;
  cnhCategory: "D" | "E";
  cnhExpiresAt: string;
  phone: string;
  carrier: string;
  status: DriverStatus;
}

export interface Vehicle {
  id: string;
  plate: string;
  type: string;
  model: string;
  carrier: string;
  renavam: string;
  capacityTons: number;
  status: VehicleStatus;
}

export interface Terminal {
  id: string;
  name: string;
  code: string;
  location: string;
  gates: number;
  openingTime: string;
  closingTime: string;
  hourlyCapacity: number;
  status: TerminalStatus;
}

export type NewDriver = Omit<Driver, "id" | "status">;
export type NewVehicle = Omit<Vehicle, "id" | "status">;
export type NewTerminal = Omit<Terminal, "id" | "status">;
