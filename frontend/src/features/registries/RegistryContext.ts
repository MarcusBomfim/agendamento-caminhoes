import { createContext } from "react";
import type { Driver, DriverFormValues, Terminal, TerminalFormValues, Vehicle, VehicleFormValues } from "./types";

export interface RegistryContextValue {
  drivers: Driver[];
  vehicles: Vehicle[];
  terminals: Terminal[];
  createDriver: (values: DriverFormValues) => Driver;
  createVehicle: (values: VehicleFormValues) => Vehicle;
  createTerminal: (values: TerminalFormValues) => Terminal;
  toggleDriverStatus: (id: string) => void;
  toggleVehicleStatus: (id: string) => void;
  toggleTerminalStatus: (id: string) => void;
}

export const RegistryContext = createContext<RegistryContextValue | null>(null);
