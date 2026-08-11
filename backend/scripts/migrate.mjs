import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import pg from "pg";

try { process.loadEnvFile(); } catch {}
if (!process.env.DATABASE_URL) throw new Error("Configure DATABASE_URL no arquivo backend/.env");

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
const migrationsDirectory = resolve(process.cwd(), "../database/migrations");
await client.connect();

try {
  const files = (await readdir(migrationsDirectory)).filter((file) => file.endsWith(".sql")).sort();
  for (const file of files) {
    await client.query(await readFile(resolve(migrationsDirectory, file), "utf8"));
    console.log(`Migration aplicada: ${file}`);
  }
} finally {
  await client.end();
}
