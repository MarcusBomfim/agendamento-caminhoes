export type UserRole = "ADMIN" | "OPERATOR" | "VIEWER";

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  active: boolean;
  tokenVersion: number;
}

export type AuthenticatedUser = Pick<User, "id" | "name" | "email" | "role">;
export type ManagedUser = AuthenticatedUser & Pick<User, "active">;

export interface NewUser {
  name: string;
  email: string;
  password: string;
  role: Exclude<UserRole, "VIEWER">;
}

export interface PasswordResetToken {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  usedAt?: Date;
  createdAt: Date;
}
