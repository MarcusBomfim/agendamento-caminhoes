export type UserRole = "ADMIN" | "OPERATOR";

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  active: boolean;
}

export type AuthenticatedUser = Omit<User, "passwordHash" | "active">;
export type ManagedUser = AuthenticatedUser & Pick<User, "active">;

export interface NewUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}
