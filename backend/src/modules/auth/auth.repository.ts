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

const demoUsers: User[] = [{
  id: "USR-DEMO-001",
  name: "Operador Portuário",
  email: env.DEMO_USER_EMAIL.toLowerCase(),
  passwordHash: hashSync(env.DEMO_USER_PASSWORD, 10),
  role: "ADMIN",
  active: true,
}];

function mapUser(row: UserRow): User {
  return { id: row.id, name: row.name, email: row.email, passwordHash: row.password_hash, role: row.role, active: row.active };
}

const userColumns = "id, name, email, password_hash, role, active";

export class AuthRepository {
  async findByEmail(email: string) {
    if (!databaseEnabled) return demoUsers.find((user) => user.email === email.toLowerCase());
    const result = await query<UserRow>(`SELECT ${userColumns} FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1`, [email]);
    return result.rows[0] ? mapUser(result.rows[0]) : undefined;
  }

  async findById(id: string) {
    if (!databaseEnabled) return demoUsers.find((user) => user.id === id);
    const result = await query<UserRow>(`SELECT ${userColumns} FROM users WHERE id = $1 LIMIT 1`, [id]);
    return result.rows[0] ? mapUser(result.rows[0]) : undefined;
  }

  async list() {
    if (!databaseEnabled) return [...demoUsers];
    const result = await query<UserRow>(`SELECT ${userColumns} FROM users ORDER BY created_at DESC`);
    return result.rows.map(mapUser);
  }

  async create(user: User) {
    if (!databaseEnabled) {
      demoUsers.unshift(user);
      return user;
    }
    const result = await query<UserRow>(
      `INSERT INTO users (id, name, email, password_hash, role, active)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING ${userColumns}`,
      [user.id, user.name, user.email, user.passwordHash, user.role, user.active],
    );
    return mapUser(result.rows[0]!);
  }

  async updateActive(id: string, active: boolean) {
    if (!databaseEnabled) {
      const user = demoUsers.find((item) => item.id === id);
      if (user) user.active = active;
      return user;
    }
    const result = await query<UserRow>(
      `UPDATE users SET active = $2, updated_at = NOW() WHERE id = $1 RETURNING ${userColumns}`,
      [id, active],
    );
    return result.rows[0] ? mapUser(result.rows[0]) : undefined;
  }
}

export const authRepository = new AuthRepository();
