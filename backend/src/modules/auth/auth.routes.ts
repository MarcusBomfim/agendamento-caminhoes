import type { Route } from "../../shared/http/types.ts";
import { login, me } from "./auth.controller.ts";

export const authRoutes: Route[] = [
  { method: "POST", path: "/api/auth/login", handler: login },
  { method: "GET", path: "/api/auth/me", handler: me, protected: true },
];
