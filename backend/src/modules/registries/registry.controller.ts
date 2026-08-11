import type { RouteHandler } from "../../shared/http/types.ts";
import { createDriverSchema, createTerminalSchema, createVehicleSchema, driverStatusSchema, terminalStatusSchema, vehicleStatusSchema } from "./registry.schemas.ts";
import { registryService } from "./registry.service.ts";

export const listDrivers: RouteHandler = async () => ({ body: { data: await registryService.listDrivers() } });
export const listVehicles: RouteHandler = async () => ({ body: { data: await registryService.listVehicles() } });
export const listTerminals: RouteHandler = async () => ({ body: { data: await registryService.listTerminals() } });
export const createDriver: RouteHandler = async ({ body }) => ({ status: 201, body: { data: await registryService.createDriver(createDriverSchema.parse(body)) } });
export const createVehicle: RouteHandler = async ({ body }) => ({ status: 201, body: { data: await registryService.createVehicle(createVehicleSchema.parse(body)) } });
export const createTerminal: RouteHandler = async ({ body }) => ({ status: 201, body: { data: await registryService.createTerminal(createTerminalSchema.parse(body)) } });
export const updateDriverStatus: RouteHandler = async ({ params, body }) => ({ body: { data: await registryService.updateDriverStatus(params.id ?? "", driverStatusSchema.parse(body).status) } });
export const updateVehicleStatus: RouteHandler = async ({ params, body }) => ({ body: { data: await registryService.updateVehicleStatus(params.id ?? "", vehicleStatusSchema.parse(body).status) } });
export const updateTerminalStatus: RouteHandler = async ({ params, body }) => ({ body: { data: await registryService.updateTerminalStatus(params.id ?? "", terminalStatusSchema.parse(body).status) } });
