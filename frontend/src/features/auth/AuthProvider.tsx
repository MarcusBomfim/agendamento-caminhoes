import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { apiRequest, getAccessToken, setAccessToken } from "../../services/apiClient";
import { queryClient } from "../../app/queryClient";
import { AuthContext } from "./AuthContext";
import type { AuthSession, AuthUser } from "./types";

const USER_KEY = "porto-agenda:user";

function storedUser(): AuthUser | null {
  try { const value = window.localStorage.getItem(USER_KEY); return value ? JSON.parse(value) as AuthUser : null; } catch { return null; }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => getAccessToken() ? storedUser() : null);

  const logout = useCallback(() => {
    setAccessToken(null);
    window.localStorage.removeItem(USER_KEY);
    setUser(null);
    queryClient.clear();
  }, []);

  useEffect(() => {
    window.addEventListener("porto-agenda:unauthorized", logout);
    return () => window.removeEventListener("porto-agenda:unauthorized", logout);
  }, [logout]);

  const login = useCallback(async (email: string, password: string) => {
    const session = await apiRequest<AuthSession>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
    setAccessToken(session.token);
    window.localStorage.setItem(USER_KEY, JSON.stringify(session.user));
    setUser(session.user);
  }, []);

  const value = useMemo(() => ({ user, authenticated: Boolean(user && getAccessToken()), login, logout }), [user, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
