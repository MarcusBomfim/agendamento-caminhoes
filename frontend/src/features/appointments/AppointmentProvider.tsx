import { useCallback, useMemo, useState, type ReactNode } from "react";
import { initialAppointments } from "./data";
import { AppointmentContext } from "./AppointmentContext";
import type { Appointment, AppointmentFormValues, AppointmentStatus } from "./types";

export function AppointmentProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);

  const createAppointment = useCallback((values: AppointmentFormValues): Appointment => {
    const timestamp = Date.now();
    const appointment: Appointment = {
      id: `PA-${timestamp.toString().slice(-9)}`,
      scheduledDate: values.scheduledDate,
      scheduledTime: values.scheduledTime,
      estimatedMinutes: Number(values.estimatedMinutes),
      carrier: values.carrier,
      driver: values.driver,
      vehiclePlate: values.vehiclePlate,
      terminal: values.terminal,
      gate: values.gate,
      operation: values.operation,
      containerNumber: values.containerNumber,
      status: "PENDENTE",
      notes: values.notes,
      createdAt: new Date().toISOString(),
    };

    setAppointments((current) => [appointment, ...current]);
    return appointment;
  }, []);

  const updateAppointmentStatus = useCallback((id: string, status: AppointmentStatus) => {
    setAppointments((current) => current.map((item) => item.id === id ? { ...item, status } : item));
  }, []);

  const value = useMemo(
    () => ({ appointments, createAppointment, updateAppointmentStatus }),
    [appointments, createAppointment, updateAppointmentStatus],
  );

  return <AppointmentContext.Provider value={value}>{children}</AppointmentContext.Provider>;
}
