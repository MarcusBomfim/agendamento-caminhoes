export type UserRole = "ADMIN" | "OPERATOR";

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
}

export interface UserFormValues {
  name: string;
  email: string;
  role: UserRole;
  password: string;
  confirmPassword: string;
}
