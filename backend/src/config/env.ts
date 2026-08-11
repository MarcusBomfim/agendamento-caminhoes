import { z } from "zod";

try {
  process.loadEnvFile();
} catch {
  // O arquivo .env é opcional no modo demonstrativo.
}

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3333),
  FRONTEND_URL: z.string().url().default("http://localhost:5173"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().url().optional(),
  DATABASE_SSL: z.enum(["true", "false"]).transform((value) => value === "true").optional(),
  JWT_SECRET: z.string().min(32).default("porto-agenda-development-secret-key-2026"),
  JWT_EXPIRES_IN: z.string().default("8h"),
  DEMO_USER_EMAIL: z.string().email().default("admin@portoagenda.com"),
  DEMO_USER_PASSWORD: z.string().min(8).default("Porto@123"),
});

export const env = envSchema.parse(process.env);
