import { describe, expect, it } from "vitest";
import { userSchema } from "./userSchema";

const validUser = {
  name: "Novo Operador",
  email: "operador@portoagenda.com",
  role: "OPERATOR" as const,
  password: "Porto@2026",
  confirmPassword: "Porto@2026",
};

describe("userSchema", () => {
  it("aceita uma senha forte confirmada", () => {
    expect(userSchema.safeParse(validUser).success).toBe(true);
  });

  it("recusa senha sem os requisitos de segurança", () => {
    expect(userSchema.safeParse({ ...validUser, password: "senhafraca", confirmPassword: "senhafraca" }).success).toBe(false);
  });

  it("recusa confirmação diferente", () => {
    const result = userSchema.safeParse({ ...validUser, confirmPassword: "Outra@2026" });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues.some((issue) => issue.path[0] === "confirmPassword")).toBe(true);
  });
});
