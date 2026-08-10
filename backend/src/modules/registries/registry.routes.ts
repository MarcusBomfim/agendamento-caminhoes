import type { Route } from "../../shared/http/types.ts";
import { createDriver, createTerminal, createVehicle, listDrivers, listTerminals, listVehicles, updateDriverStatus, updateTerminalStatus, updateVehicleStatus } from "./registry.controller.ts";

export const registryRoutes: Route[] = [
  { method: "GET", path: "/api/drivers", handler: listDrivers },
  { method: "POST", path: "/api/drivers", handler: createDriver },
  { method: "PATCH", path: "/api/drivers/:id/status", handler: updateDriverStatus },
  { method: "GET", path: "/api/vehicles", handler: listVehicles },
  { method: "POST", path: "/api/vehicles", handler: createVehicle },
  { method: "PATCH", path: "/api/vehicles/:id/status", handler: updateVehicleStatus },
  { method: "GET", path: "/api/terminals", handler: listTerminals },
  { method: "POST", path: "/api/terminals", handler: createTerminal },
  { method: "PATCH", path: "/api/terminals/:id/status", handler: updateTerminalStatus },
];
