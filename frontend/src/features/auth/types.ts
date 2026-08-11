export interface AuthUser { id: string; name: string; email: string; role: "ADMIN" | "OPERATOR" }
export interface AuthSession { token: string; user: AuthUser }
