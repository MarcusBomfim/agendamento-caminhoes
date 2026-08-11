import pg from "pg";
import { env } from "../config/env.ts";

const { Pool } = pg;
const useSsl = env.DATABASE_SSL ?? env.NODE_ENV === "production";

export const databaseEnabled = Boolean(env.DATABASE_URL);

export const pool = env.DATABASE_URL ? new Pool({
  connectionString: env.DATABASE_URL,
  ssl: useSsl ? { rejectUnauthorized: false } : undefined,
  max: 10,
  idleTimeoutMillis: 30_000,
}) : null;

export async function query<Rows extends pg.QueryResultRow>(text: string, values: unknown[] = []) {
  if (!pool) throw new Error("DATABASE_URL não configurada");
  return pool.query<Rows>(text, values);
}

export async function closeDatabase() {
  await pool?.end();
}
