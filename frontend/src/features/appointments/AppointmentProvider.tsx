import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, type ReactNode } from "react";
import { apiRequest } from "../../services/apiClient";
import { useAuth } from "../auth/useAuth";
import { useRegistry } from "../registries/useRegistry";
import { AppointmentContext } from "./AppointmentContext";
import type { ApiAppointment, Appointment, AppointmentFormValues, AppointmentStatus } from "./types";

export function AppointmentProvider({ children }: { children: ReactNode }) {
  const { authenticated } = useAuth();
  const { drivers, vehicles, terminals } = useRegistry();
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ["appointments"], queryFn: () => apiRequest<ApiAppointment[]>("/appointments"), enabled: authenticated });

  const mapAppointment = useCallback((item: ApiAppointment): Appointment => ({
    ...item,
    driver: drivers.find((driver) => driver.id === item.driverId)?.name ?? item.driverId,
    vehiclePlate: vehicles.find((vehicle) => vehicle.id === item.vehicleId)?.plate ?? item.vehicleId,
    terminal: terminals.find((terminal) => terminal.id === item.terminalId)?.name ?? item.terminalId,
  }), [drivers, vehicles, terminals]);

  const createMutation = useMutation({ mutationFn: (values: AppointmentFormValues) => apiRequest<ApiAppointment>("/appointments", { method: "POST", body: JSON.stringify({ ...values, estimatedMinutes: Number(values.estimatedMinutes) }) }), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["appointments"] }) });
  const appointments = useMemo(() => (query.data ?? []).map(mapAppointment), [query.data, mapAppointment]);
  const createAppointment = useCallback(async (values: AppointmentFormValues) => mapAppointment(await createMutation.mutateAsync(values)), [createMutation, mapAppointment]);
  const updateAppointmentStatus = useCallback(async (id: string, status: AppointmentStatus) => { await apiRequest(`/appointments/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }); await queryClient.invalidateQueries({ queryKey: ["appointments"] }); }, [queryClient]);

  const value = useMemo(() => ({ appointments, isLoading: query.isLoading, error: query.error instanceof Error ? query.error.message : "", createAppointment, updateAppointmentStatus }), [appointments, query.isLoading, query.error, createAppointment, updateAppointmentStatus]);
  return <AppointmentContext.Provider value={value}>{children}</AppointmentContext.Provider>;
}
