import { z } from "zod";

export const strongPasswordSchema = z.string()
  .min(10, "Use no mínimo 10 caracteres")
  .refine((password) => new TextEncoder().encode(password).length <= 72, "Use no máximo 72 bytes")
  .regex(/[a-z]/, "Inclua uma letra minúscula")
  .regex(/[A-Z]/, "Inclua uma letra maiúscula")
  .regex(/[0-9]/, "Inclua um número")
  .regex(/[^A-Za-z0-9]/, "Inclua um caractere especial");

export const userSchema = z.object({
  name: z.string().trim().min(3, "Informe o nome completo").max(120),
  email: z.string().trim().email("Informe um e-mail válido").max(180),
  role: z.enum(["ADMIN", "OPERATOR"]),
  password: strongPasswordSchema,
  confirmPassword: z.string(),
}).refine((values) => values.password === values.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});
