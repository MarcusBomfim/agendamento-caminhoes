import type { IncomingMessage, ServerResponse } from "node:http";

export type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

export interface RequestContext {
  request: IncomingMessage;
  response: ServerResponse;
  params: Record<string, string>;
  query: URLSearchParams;
  body: unknown;
}

export interface HandlerResult {
  status?: number;
  body?: unknown;
}

export type RouteHandler = (context: RequestContext) => HandlerResult | Promise<HandlerResult>;

export interface Route {
  method: HttpMethod;
  path: string;
  handler: RouteHandler;
}
