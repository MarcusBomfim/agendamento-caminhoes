import type { RouteHandler } from "../../shared/http/types.ts";
import { createDriverSchema, createTerminalSchema, createVehicleSchema, driverStatusSchema, terminalStatusSchema, vehicleStatusSchema } from "./registry.schemas.ts";
import { registryService } from "./registry.service.ts";

export const listDrivers: RouteHandler = () => ({ body: { data: registryService.listDrivers() } });
export const listVehicles: RouteHandler = () => ({ body: { data: registryService.listVehicles() } });
export const listTerminals: RouteHandler = () => ({ body: { data: registryService.listTerminals() } });

export const createDriver: RouteHandler = ({ body }) => ({ status: 201, body: { data: registryService.createDriver(createDriverSchema.parse(body)) } });
export const createVehicle: RouteHandler = ({ body }) => ({ status: 201, body: { data: registryService.createVehicle(createVehicleSchema.parse(body)) } });
export const createTerminal: RouteHandler = ({ body }) => ({ status: 201, body: { data: registryService.createTerminal(createTerminalSchema.parse(body)) } });

export const updateDriverStatus: RouteHandler = ({ params, body }) => ({ body: { data: registryService.updateDriverStatus(params.id ?? "", driverStatusSchema.parse(body).status) } });
export const updateVehicleStatus: RouteHandler = ({ params, body }) => ({ body: { data: registryService.updateVehicleStatus(params.id ?? "", vehicleStatusSchema.parse(body).status) } });
export const updateTerminalStatus: RouteHandler = ({ params, body }) => ({ body: { data: registryService.updateTerminalStatus(params.id ?? "", terminalStatusSchema.parse(body).status) } });
