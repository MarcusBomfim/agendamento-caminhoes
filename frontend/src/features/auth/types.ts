export interface AuthUser { id: string; name: string; email: string; role: "ADMIN" | "OPERATOR" | "VIEWER" }
export interface AuthSession { token: string; user: AuthUser }
