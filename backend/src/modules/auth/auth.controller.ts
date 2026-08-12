import type { RouteHandler } from "../../shared/http/types.ts";
import { createUserSchema, forgotPasswordSchema, loginSchema, resetPasswordSchema, userStatusSchema } from "./auth.schemas.ts";
import { authService } from "./auth.service.ts";

export const login: RouteHandler = async ({ body }) => {
  const credentials = loginSchema.parse(body);
  return { body: { data: await authService.login(credentials.email, credentials.password) } };
};

export const me: RouteHandler = ({ user }) => ({ body: { data: user } });
export const listUsers: RouteHandler = async ({ user }) => ({ body: { data: await authService.listUsers(user) } });
export const createUser: RouteHandler = async ({ user, body }) => ({ status: 201, body: { data: await authService.createUser(user, createUserSchema.parse(body)) } });
export const updateUserStatus: RouteHandler = async ({ user, params, body }) => ({ body: { data: await authService.updateUserStatus(user, params.id ?? "", userStatusSchema.parse(body).active) } });
export const forgotPassword: RouteHandler = async ({ body }) => ({ body: { data: await authService.requestPasswordReset(forgotPasswordSchema.parse(body).email) } });
export const resetPassword: RouteHandler = async ({ body }) => { const input = resetPasswordSchema.parse(body); return { body: { data: await authService.resetPassword(input.token, input.password) } }; };
