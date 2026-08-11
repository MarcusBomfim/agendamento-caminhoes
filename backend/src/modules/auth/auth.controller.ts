import type { RouteHandler } from "../../shared/http/types.ts";
import { loginSchema } from "./auth.schemas.ts";
import { authService } from "./auth.service.ts";

export const login: RouteHandler = async ({ body }) => {
  const credentials = loginSchema.parse(body);
  return { body: { data: await authService.login(credentials.email, credentials.password) } };
};

export const me: RouteHandler = ({ user }) => ({ body: { data: user } });
