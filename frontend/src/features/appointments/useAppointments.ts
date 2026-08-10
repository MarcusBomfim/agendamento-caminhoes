import { useContext } from "react";
import { AppointmentContext } from "./AppointmentContext";

export function useAppointments() {
  const context = useContext(AppointmentContext);
  if (!context) throw new Error("useAppointments deve ser utilizado dentro de AppointmentProvider.");
  return context;
}

