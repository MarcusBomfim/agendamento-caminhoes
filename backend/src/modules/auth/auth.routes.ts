import type { Route } from "../../shared/http/types.ts";
import { createUser, forgotPassword, listUsers, login, me, resetPassword, updateUserStatus } from "./auth.controller.ts";

export const authRoutes: Route[] = [
  { method: "POST", path: "/api/auth/login", handler: login },
  { method: "POST", path: "/api/auth/forgot-password", handler: forgotPassword },
  { method: "POST", path: "/api/auth/reset-password", handler: resetPassword },
  { method: "GET", path: "/api/auth/me", handler: me, protected: true },
  { method: "GET", path: "/api/users", handler: listUsers, protected: true, roles: ["ADMIN"] },
  { method: "POST", path: "/api/users", handler: createUser, protected: true, roles: ["ADMIN"] },
  { method: "PATCH", path: "/api/users/:id/status", handler: updateUserStatus, protected: true, roles: ["ADMIN"] },
];
