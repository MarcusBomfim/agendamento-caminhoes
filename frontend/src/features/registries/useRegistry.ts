import { useContext } from "react";
import { RegistryContext } from "./RegistryContext";

export function useRegistry() {
  const context = useContext(RegistryContext);
  if (!context) throw new Error("useRegistry deve ser usado dentro de RegistryProvider");
  return context;
}
