import { hashSync } from "bcryptjs";
import { env } from "../../config/env.ts";
import { databaseEnabled, query } from "../../database/client.ts";
import type { User, UserRole } from "./auth.types.ts";

interface UserRow {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  active: boolean;
}

const demoUser: User = {
  id: "USR-DEMO-001",
  name: "Operador Portuário",
  email: env.DEMO_USER_EMAIL,
  passwordHash: hashSync(env.DEMO_USER_PASSWORD, 10),
  role: "ADMIN",
  active: true,
};

function mapUser(row: UserRow): User {
  return { id: row.id, name: row.name, email: row.email, passwordHash: row.password_hash, role: row.role, active: row.active };
}

export class AuthRepository {
  async findByEmail(email: string) {
    if (!databaseEnabled) return demoUser.email.toLowerCase() === email.toLowerCase() ? demoUser : undefined;
    const result = await query<UserRow>("SELECT id, name, email, password_hash, role, active FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1", [email]);
    return result.rows[0] ? mapUser(result.rows[0]) : undefined;
  }

  async findById(id: string) {
    if (!databaseEnabled) return demoUser.id === id ? demoUser : undefined;
    const result = await query<UserRow>("SELECT id, name, email, password_hash, role, active FROM users WHERE id = $1 LIMIT 1", [id]);
    return result.rows[0] ? mapUser(result.rows[0]) : undefined;
  }
}

export const authRepository = new AuthRepository();
