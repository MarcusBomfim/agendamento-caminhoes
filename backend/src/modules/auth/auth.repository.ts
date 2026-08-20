import { hashSync } from "bcryptjs";
import { env } from "../../config/env.ts";
import { databaseEnabled, query } from "../../database/client.ts";
import { LEGACY_DEMO_PASSWORD_HASH, SEEDED_ADMIN_ID } from "./auth.constants.ts";
import type { PasswordResetToken, User, UserRole } from "./auth.types.ts";

interface UserRow {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  active: boolean;
  token_version: number;
}

const demoUsers: User[] = [{
  id: "USR-DEMO-001",
  name: "Operador Portuário",
  email: env.DEMO_USER_EMAIL.toLowerCase(),
  passwordHash: hashSync(env.DEMO_USER_PASSWORD, 10),
  role: "ADMIN",
  active: true,
  tokenVersion: 0,
}];

const demoResetTokens: PasswordResetToken[] = [];

function mapUser(row: UserRow): User {
  return { id: row.id, name: row.name, email: row.email, passwordHash: row.password_hash, role: row.role, active: row.active, tokenVersion: row.token_version };
}

const userColumns = "id, name, email, password_hash, role, active, token_version";

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

  async secureSeededAdmin(email: string, passwordHash: string) {
    if (!databaseEnabled) return false;
    const result = await query<{ id: string }>(
      `UPDATE users
       SET email = $1, password_hash = $2, role = 'ADMIN', active = TRUE,
           token_version = token_version + 1, updated_at = NOW()
       WHERE id = $3 AND password_hash = $4
       RETURNING id`,
      [email.toLowerCase(), passwordHash, SEEDED_ADMIN_ID, LEGACY_DEMO_PASSWORD_HASH],
    );
    return Boolean(result.rows[0]);
  }

  async updateActive(id: string, active: boolean) {
    if (!databaseEnabled) {
      const user = demoUsers.find((item) => item.id === id);
      if (user) {
        user.active = active;
        if (!active) user.tokenVersion += 1;
      }
      return user;
    }
    const result = await query<UserRow>(
      `UPDATE users
       SET active = $2, token_version = CASE WHEN $2 THEN token_version ELSE token_version + 1 END, updated_at = NOW()
       WHERE id = $1 RETURNING ${userColumns}`,
      [id, active],
    );
    return result.rows[0] ? mapUser(result.rows[0]) : undefined;
  }

  async hasRecentResetToken(userId: string, since: Date) {
    if (!databaseEnabled) return demoResetTokens.some((token) => token.userId === userId && token.createdAt >= since);
    const result = await query<{ exists: boolean }>(
      "SELECT EXISTS (SELECT 1 FROM password_reset_tokens WHERE user_id = $1 AND created_at >= $2) AS exists",
      [userId, since],
    );
    return result.rows[0]?.exists ?? false;
  }

  async createResetToken(token: PasswordResetToken) {
    if (!databaseEnabled) {
      for (const item of demoResetTokens) if (item.userId === token.userId && !item.usedAt) item.usedAt = new Date();
      demoResetTokens.push(token);
      return;
    }
    await query("UPDATE password_reset_tokens SET used_at = NOW() WHERE user_id = $1 AND used_at IS NULL", [token.userId]);
    await query(
      "INSERT INTO password_reset_tokens (id, user_id, token_hash, expires_at) VALUES ($1, $2, $3, $4)",
      [token.id, token.userId, token.tokenHash, token.expiresAt],
    );
  }

  async resetPassword(tokenHash: string, passwordHash: string) {
    if (!databaseEnabled) {
      const now = new Date();
      const token = demoResetTokens.find((item) => item.tokenHash === tokenHash && !item.usedAt && item.expiresAt > now);
      if (!token) return false;
      const user = demoUsers.find((item) => item.id === token.userId && item.active);
      if (!user) return false;
      token.usedAt = now;
      user.passwordHash = passwordHash;
      user.tokenVersion += 1;
      for (const item of demoResetTokens) if (item.userId === user.id && !item.usedAt) item.usedAt = now;
      return true;
    }

    const result = await query<{ id: string }>(
      `WITH consumed AS (
         UPDATE password_reset_tokens
         SET used_at = NOW()
         WHERE token_hash = $1 AND used_at IS NULL AND expires_at > NOW()
         RETURNING user_id
       )
       UPDATE users
       SET password_hash = $2, token_version = token_version + 1, updated_at = NOW()
       WHERE id = (SELECT user_id FROM consumed) AND active = TRUE
       RETURNING id`,
      [tokenHash, passwordHash],
    );
    if (!result.rows[0]) return false;
    await query("UPDATE password_reset_tokens SET used_at = NOW() WHERE user_id = $1 AND used_at IS NULL", [result.rows[0].id]);
    return true;
  }
}

export const authRepository = new AuthRepository();
