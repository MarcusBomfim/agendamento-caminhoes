import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8).max(100),
});

export const strongPasswordSchema = z.string()
  .min(10, "A senha deve ter no mínimo 10 caracteres")
  .refine((password) => Buffer.byteLength(password, "utf8") <= 72, "A senha deve ter no máximo 72 bytes")
  .regex(/[a-z]/, "Inclua uma letra minúscula")
  .regex(/[A-Z]/, "Inclua uma letra maiúscula")
  .regex(/[0-9]/, "Inclua um número")
  .regex(/[^A-Za-z0-9]/, "Inclua um caractere especial");

export const createUserSchema = z.object({
  name: z.string().trim().min(3, "Informe o nome completo").max(120),
  email: z.string().trim().email("Informe um e-mail válido").max(180).transform((email) => email.toLowerCase()),
  password: strongPasswordSchema,
  role: z.enum(["ADMIN", "OPERATOR"]).default("OPERATOR"),
});

export const userStatusSchema = z.object({ active: z.boolean() });

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Informe um e-mail válido").max(180).transform((email) => email.toLowerCase()),
});

export const resetPasswordSchema = z.object({
  token: z.string().regex(/^[a-f0-9]{64}$/i, "Token de recuperação inválido"),
  password: strongPasswordSchema,
});
