import { z } from "zod";

try {
  process.loadEnvFile();
} catch {
  // O arquivo .env é opcional no modo demonstrativo.
}

const optionalText = z.preprocess((value) => value === "" ? undefined : value, z.string().optional());

const insecureSecretMarkers = ["troque", "change-me", "example", "development-secret", "local-docker-secret"];

function isStrongPassword(value: string) {
  return value.length >= 12
    && /[a-z]/.test(value)
    && /[A-Z]/.test(value)
    && /\d/.test(value)
    && /[^A-Za-z0-9]/.test(value)
    && Buffer.byteLength(value, "utf8") <= 72;
}

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3333),
  FRONTEND_URL: z.string().url().default("http://localhost:5173"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().url().optional(),
  DATABASE_SSL: z.enum(["true", "false"]).transform((value) => value === "true").optional(),
  DATABASE_SSL_REJECT_UNAUTHORIZED: z.enum(["true", "false"]).default("true").transform((value) => value === "true"),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default("8h"),
  DEMO_USER_EMAIL: z.string().email().default("admin@portoagenda.com"),
  DEMO_USER_PASSWORD: z.string().min(10),
  DEMO_VISITOR_ENABLED: z.enum(["true", "false"]).default("true").transform((value) => value === "true"),
  PASSWORD_RESET_EXPIRES_MINUTES: z.coerce.number().int().min(5).max(120).default(30),
  PASSWORD_RESET_COOLDOWN_SECONDS: z.coerce.number().int().min(30).max(3600).default(60),
  PASSWORD_RESET_EXPOSE_LINK: z.enum(["true", "false"]).default("false").transform((value) => value === "true"),
  SMTP_HOST: optionalText,
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_SECURE: z.enum(["true", "false"]).default("false").transform((value) => value === "true"),
  SMTP_USER: optionalText,
  SMTP_PASSWORD: optionalText,
  SMTP_FROM: optionalText,
  TRUST_PROXY: z.enum(["true", "false"]).default("false").transform((value) => value === "true"),
}).superRefine((values, context) => {
  if (values.NODE_ENV !== "production") return;

  if (!values.DATABASE_URL) {
    context.addIssue({ code: "custom", path: ["DATABASE_URL"], message: "DATABASE_URL é obrigatória em produção" });
  }

  const normalizedSecret = values.JWT_SECRET.toLowerCase();
  if (values.JWT_SECRET.length < 48 || insecureSecretMarkers.some((marker) => normalizedSecret.includes(marker))) {
    context.addIssue({ code: "custom", path: ["JWT_SECRET"], message: "Use uma chave JWT aleatória com pelo menos 48 caracteres em produção" });
  }

  const normalizedPassword = values.DEMO_USER_PASSWORD.toLowerCase();
  if (!isStrongPassword(values.DEMO_USER_PASSWORD) || insecureSecretMarkers.some((marker) => normalizedPassword.includes(marker))) {
    context.addIssue({ code: "custom", path: ["DEMO_USER_PASSWORD"], message: "Defina uma senha administrativa inédita, forte e com 12 caracteres ou mais" });
  }

  if (values.PASSWORD_RESET_EXPOSE_LINK) {
    context.addIssue({ code: "custom", path: ["PASSWORD_RESET_EXPOSE_LINK"], message: "Links de recuperação não podem ser expostos em produção" });
  }
});

export const env = envSchema.parse(process.env);
