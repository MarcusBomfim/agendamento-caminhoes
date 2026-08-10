import { createContext } from "react";
import type { Appointment, AppointmentFormValues, AppointmentStatus } from "./types";

export interface AppointmentContextValue {
  appointments: Appointment[];
  createAppointment: (values: AppointmentFormValues) => Appointment;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
}

export const AppointmentContext = createContext<AppointmentContextValue | undefined>(undefined);

