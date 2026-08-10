import type { IncomingMessage, ServerResponse } from "node:http";
import { ZodError } from "zod";
import { env } from "./config/env.ts";
import { appointmentRoutes } from "./modules/appointments/appointment.routes.ts";
import { registryRoutes } from "./modules/registries/registry.routes.ts";
import { AppError } from "./shared/errors/AppError.ts";
import { readJsonBody } from "./shared/http/body.ts";
import { findRoute } from "./shared/http/router.ts";
import type { Route } from "./shared/http/types.ts";

const routes: Route[] = [
  { method: "GET", path: "/api/health", handler: () => ({ body: { status: "ok", service: "porto-agenda-api", timestamp: new Date().toISOString() } }) },
  ...appointmentRoutes,
  ...registryRoutes,
];

function sendJson(response: ServerResponse, status: number, body: unknown) {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(JSON.stringify(body));
}

function applyHeaders(response: ServerResponse) {
  response.setHeader("Access-Control-Allow-Origin", env.FRONTEND_URL);
  response.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("X-Frame-Options", "DENY");
  response.setHeader("Referrer-Policy", "no-referrer");
}

export async function handleRequest(request: IncomingMessage, response: ServerResponse) {
  applyHeaders(response);
  if (request.method === "OPTIONS") { response.statusCode = 204; response.end(); return; }

  try {
    const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);
    const match = findRoute(routes, request.method ?? "GET", url.pathname);
    if (!match) throw new AppError(404, "Rota não encontrada");

    const body = await readJsonBody(request);
    const result = await match.route.handler({ request, response, params: match.params, query: url.searchParams, body });
    sendJson(response, result.status ?? 200, result.body ?? null);
  } catch (error) {
    if (error instanceof ZodError) {
      sendJson(response, 400, { error: "Dados inválidos", details: error.issues.map((issue) => ({ field: issue.path.join("."), message: issue.message })) });
      return;
    }
    if (error instanceof AppError) {
      sendJson(response, error.statusCode, { error: error.message, details: error.details });
      return;
    }
    console.error(error);
    sendJson(response, 500, { error: "Erro interno do servidor" });
  }
}
