import { useCallback, useMemo, useState, type ReactNode } from "react";
import { initialDrivers, initialTerminals, initialVehicles } from "./data";
import { RegistryContext } from "./RegistryContext";
import type { Driver, DriverFormValues, Terminal, TerminalFormValues, Vehicle, VehicleFormValues } from "./types";

function nextId(prefix: string) {
  return `${prefix}-${Date.now().toString().slice(-6)}`;
}

export function RegistryProvider({ children }: { children: ReactNode }) {
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [terminals, setTerminals] = useState<Terminal[]>(initialTerminals);

  const createDriver = useCallback((values: DriverFormValues) => {
    const driver: Driver = { id: nextId("MOT"), ...values, status: "ATIVO" };
    setDrivers((current) => [driver, ...current]);
    return driver;
  }, []);

  const createVehicle = useCallback((values: VehicleFormValues) => {
    const vehicle: Vehicle = { id: nextId("VEI"), ...values, capacityTons: Number(values.capacityTons), status: "DISPONÍVEL" };
    setVehicles((current) => [vehicle, ...current]);
    return vehicle;
  }, []);

  const createTerminal = useCallback((values: TerminalFormValues) => {
    const terminal: Terminal = { id: nextId("TER"), ...values, gates: Number(values.gates), hourlyCapacity: Number(values.hourlyCapacity), status: "OPERACIONAL" };
    setTerminals((current) => [terminal, ...current]);
    return terminal;
  }, []);

  const toggleDriverStatus = useCallback((id: string) => {
    setDrivers((current) => current.map((driver) => driver.id === id ? { ...driver, status: driver.status === "ATIVO" ? "INATIVO" : "ATIVO" } : driver));
  }, []);

  const toggleVehicleStatus = useCallback((id: string) => {
    setVehicles((current) => current.map((vehicle) => vehicle.id === id ? { ...vehicle, status: vehicle.status === "INATIVO" ? "DISPONÍVEL" : "INATIVO" } : vehicle));
  }, []);

  const toggleTerminalStatus = useCallback((id: string) => {
    setTerminals((current) => current.map((terminal) => terminal.id === id ? { ...terminal, status: terminal.status === "INATIVO" ? "OPERACIONAL" : "INATIVO" } : terminal));
  }, []);

  const value = useMemo(() => ({
    drivers,
    vehicles,
    terminals,
    createDriver,
    createVehicle,
    createTerminal,
    toggleDriverStatus,
    toggleVehicleStatus,
    toggleTerminalStatus,
  }), [drivers, vehicles, terminals, createDriver, createVehicle, createTerminal, toggleDriverStatus, toggleVehicleStatus, toggleTerminalStatus]);

  return <RegistryContext.Provider value={value}>{children}</RegistryContext.Provider>;
}
