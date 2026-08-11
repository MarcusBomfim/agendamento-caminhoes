import { compare } from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../../config/env.ts";
import { AppError } from "../../shared/errors/AppError.ts";
import { authRepository } from "./auth.repository.ts";
import type { AuthenticatedUser, User } from "./auth.types.ts";

function publicUser(user: User): AuthenticatedUser {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export class AuthService {
  async login(email: string, password: string) {
    const user = await authRepository.findByEmail(email);
    if (!user || !user.active || !(await compare(password, user.passwordHash))) throw new AppError(401, "E-mail ou senha inválidos");

    const token = jwt.sign({ role: user.role, email: user.email }, env.JWT_SECRET, {
      subject: user.id,
      expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
      issuer: "porto-agenda-api",
    });
    return { token, user: publicUser(user) };
  }

  async authenticate(token: string) {
    try {
      const payload = jwt.verify(token, env.JWT_SECRET, { issuer: "porto-agenda-api" });
      if (typeof payload === "string" || !payload.sub) throw new Error("Token sem usuário");
      const user = await authRepository.findById(payload.sub);
      if (!user || !user.active) throw new Error("Usuário inativo");
      return publicUser(user);
    } catch {
      throw new AppError(401, "Sessão inválida ou expirada");
    }
  }
}

export const authService = new AuthService();
