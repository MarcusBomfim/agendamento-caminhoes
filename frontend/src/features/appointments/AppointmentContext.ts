import { createContext } from "react";
import type { Appointment, AppointmentFormValues, AppointmentStatus } from "./types";

export interface AppointmentContextValue {
  appointments: Appointment[];
  isLoading: boolean;
  error: string;
  createAppointment: (values: AppointmentFormValues) => Promise<Appointment>;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => Promise<void>;
}

export const AppointmentContext = createContext<AppointmentContextValue | undefined>(undefined);
