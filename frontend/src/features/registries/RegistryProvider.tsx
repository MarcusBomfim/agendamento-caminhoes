import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, type ReactNode } from "react";
import { apiRequest } from "../../services/apiClient";
import { useAuth } from "../auth/useAuth";
import { RegistryContext } from "./RegistryContext";
import type { Driver, DriverFormValues, Terminal, TerminalFormValues, Vehicle, VehicleFormValues } from "./types";

const EMPTY_DRIVERS: Driver[] = [];
const EMPTY_VEHICLES: Vehicle[] = [];
const EMPTY_TERMINALS: Terminal[] = [];

export function RegistryProvider({ children }: { children: ReactNode }) {
  const { authenticated } = useAuth();
  const queryClient = useQueryClient();
  const driversQuery = useQuery({ queryKey: ["drivers"], queryFn: () => apiRequest<Driver[]>("/drivers"), enabled: authenticated });
  const vehiclesQuery = useQuery({ queryKey: ["vehicles"], queryFn: () => apiRequest<Vehicle[]>("/vehicles"), enabled: authenticated });
  const terminalsQuery = useQuery({ queryKey: ["terminals"], queryFn: () => apiRequest<Terminal[]>("/terminals"), enabled: authenticated });

  const createDriverMutation = useMutation({ mutationFn: (values: DriverFormValues) => apiRequest<Driver>("/drivers", { method: "POST", body: JSON.stringify(values) }), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["drivers"] }) });
  const createVehicleMutation = useMutation({ mutationFn: (values: VehicleFormValues) => apiRequest<Vehicle>("/vehicles", { method: "POST", body: JSON.stringify({ ...values, capacityTons: Number(values.capacityTons) }) }), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["vehicles"] }) });
  const createTerminalMutation = useMutation({ mutationFn: (values: TerminalFormValues) => apiRequest<Terminal>("/terminals", { method: "POST", body: JSON.stringify({ ...values, gates: Number(values.gates), hourlyCapacity: Number(values.hourlyCapacity) }) }), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["terminals"] }) });

  const drivers = driversQuery.data ?? EMPTY_DRIVERS;
  const vehicles = vehiclesQuery.data ?? EMPTY_VEHICLES;
  const terminals = terminalsQuery.data ?? EMPTY_TERMINALS;

  const toggleDriverStatus = useCallback(async (id: string) => { const item = drivers.find((driver) => driver.id === id); if (!item) return; await apiRequest(`/drivers/${id}/status`, { method: "PATCH", body: JSON.stringify({ status: item.status === "ATIVO" ? "INATIVO" : "ATIVO" }) }); await queryClient.invalidateQueries({ queryKey: ["drivers"] }); }, [drivers, queryClient]);
  const toggleVehicleStatus = useCallback(async (id: string) => { const item = vehicles.find((vehicle) => vehicle.id === id); if (!item) return; await apiRequest(`/vehicles/${id}/status`, { method: "PATCH", body: JSON.stringify({ status: item.status === "INATIVO" ? "DISPONÍVEL" : "INATIVO" }) }); await queryClient.invalidateQueries({ queryKey: ["vehicles"] }); }, [vehicles, queryClient]);
  const toggleTerminalStatus = useCallback(async (id: string) => { const item = terminals.find((terminal) => terminal.id === id); if (!item) return; await apiRequest(`/terminals/${id}/status`, { method: "PATCH", body: JSON.stringify({ status: item.status === "INATIVO" ? "OPERACIONAL" : "INATIVO" }) }); await queryClient.invalidateQueries({ queryKey: ["terminals"] }); }, [terminals, queryClient]);

  const error = [driversQuery.error, vehiclesQuery.error, terminalsQuery.error].find(Boolean);
  const value = useMemo(() => ({
    drivers, vehicles, terminals,
    isLoading: driversQuery.isLoading || vehiclesQuery.isLoading || terminalsQuery.isLoading,
    error: error instanceof Error ? error.message : "",
    createDriver: createDriverMutation.mutateAsync,
    createVehicle: createVehicleMutation.mutateAsync,
    createTerminal: createTerminalMutation.mutateAsync,
    toggleDriverStatus, toggleVehicleStatus, toggleTerminalStatus,
  }), [drivers, vehicles, terminals, driversQuery.isLoading, vehiclesQuery.isLoading, terminalsQuery.isLoading, error, createDriverMutation.mutateAsync, createVehicleMutation.mutateAsync, createTerminalMutation.mutateAsync, toggleDriverStatus, toggleVehicleStatus, toggleTerminalStatus]);

  return <RegistryContext.Provider value={value}>{children}</RegistryContext.Provider>;
}
