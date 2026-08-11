import { createContext } from "react";
import type { Driver, DriverFormValues, Terminal, TerminalFormValues, Vehicle, VehicleFormValues } from "./types";

export interface RegistryContextValue {
  drivers: Driver[];
  vehicles: Vehicle[];
  terminals: Terminal[];
  isLoading: boolean;
  error: string;
  createDriver: (values: DriverFormValues) => Promise<Driver>;
  createVehicle: (values: VehicleFormValues) => Promise<Vehicle>;
  createTerminal: (values: TerminalFormValues) => Promise<Terminal>;
  toggleDriverStatus: (id: string) => Promise<void>;
  toggleVehicleStatus: (id: string) => Promise<void>;
  toggleTerminalStatus: (id: string) => Promise<void>;
}

export const RegistryContext = createContext<RegistryContextValue | null>(null);
