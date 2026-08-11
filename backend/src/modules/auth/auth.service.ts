import { compare, hash } from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../../config/env.ts";
import { AppError } from "../../shared/errors/AppError.ts";
import { createId } from "../../shared/utils/createId.ts";
import { authRepository } from "./auth.repository.ts";
import type { AuthenticatedUser, ManagedUser, NewUser, User } from "./auth.types.ts";

function publicUser(user: User): AuthenticatedUser {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

function managedUser(user: User): ManagedUser {
  return { ...publicUser(user), active: user.active };
}

function requireAdmin(user: AuthenticatedUser | undefined): asserts user is AuthenticatedUser {
  if (!user || user.role !== "ADMIN") throw new AppError(403, "Acesso permitido somente para administradores");
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

  async listUsers(actor: AuthenticatedUser | undefined) {
    requireAdmin(actor);
    return (await authRepository.list()).map(managedUser);
  }

  async createUser(actor: AuthenticatedUser | undefined, input: NewUser) {
    requireAdmin(actor);
    if (await authRepository.findByEmail(input.email)) throw new AppError(409, "E-mail já cadastrado");

    const user: User = {
      id: createId("USR"),
      name: input.name,
      email: input.email,
      passwordHash: await hash(input.password, 12),
      role: input.role,
      active: true,
    };

    try {
      return managedUser(await authRepository.create(user));
    } catch (error) {
      if ((error as { code?: string }).code === "23505") throw new AppError(409, "E-mail já cadastrado");
      throw error;
    }
  }

  async updateUserStatus(actor: AuthenticatedUser | undefined, id: string, active: boolean) {
    requireAdmin(actor);
    if (actor.id === id && !active) throw new AppError(422, "Você não pode desativar a própria conta");
    const user = await authRepository.updateActive(id, active);
    if (!user) throw new AppError(404, "Usuário não encontrado");
    return managedUser(user);
  }
}

export const authService = new AuthService();
