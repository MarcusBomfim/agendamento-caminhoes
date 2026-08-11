import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router";
import type { ReactNode } from "react";
import { AppointmentProvider } from "../features/appointments/AppointmentProvider";
import { RegistryProvider } from "../features/registries/RegistryProvider";
import { AuthProvider } from "../features/auth/AuthProvider";
import { queryClient } from "./queryClient";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RegistryProvider>
          <AppointmentProvider>
            <BrowserRouter>{children}</BrowserRouter>
          </AppointmentProvider>
        </RegistryProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
