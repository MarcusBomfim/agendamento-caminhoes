import type { Route } from "../../shared/http/types.ts";
import { createDriver, createTerminal, createVehicle, listDrivers, listTerminals, listVehicles, updateDriverStatus, updateTerminalStatus, updateVehicleStatus } from "./registry.controller.ts";

export const registryRoutes: Route[] = [
  { method: "GET", path: "/api/drivers", handler: listDrivers, protected: true },
  { method: "POST", path: "/api/drivers", handler: createDriver, protected: true, roles: ["ADMIN", "OPERATOR"] },
  { method: "PATCH", path: "/api/drivers/:id/status", handler: updateDriverStatus, protected: true, roles: ["ADMIN", "OPERATOR"] },
  { method: "GET", path: "/api/vehicles", handler: listVehicles, protected: true },
  { method: "POST", path: "/api/vehicles", handler: createVehicle, protected: true, roles: ["ADMIN", "OPERATOR"] },
  { method: "PATCH", path: "/api/vehicles/:id/status", handler: updateVehicleStatus, protected: true, roles: ["ADMIN", "OPERATOR"] },
  { method: "GET", path: "/api/terminals", handler: listTerminals, protected: true },
  { method: "POST", path: "/api/terminals", handler: createTerminal, protected: true, roles: ["ADMIN", "OPERATOR"] },
  { method: "PATCH", path: "/api/terminals/:id/status", handler: updateTerminalStatus, protected: true, roles: ["ADMIN", "OPERATOR"] },
];
