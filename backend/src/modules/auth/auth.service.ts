import { compare, hash } from "bcryptjs";
import { createHash, randomBytes } from "node:crypto";
import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../../config/env.ts";
import { AppError } from "../../shared/errors/AppError.ts";
import { createId } from "../../shared/utils/createId.ts";
import { authRepository } from "./auth.repository.ts";
import { DEMO_VISITOR, LEGACY_DEMO_PASSWORD_HASH } from "./auth.constants.ts";
import { sendPasswordResetEmail } from "./password-reset-email.service.ts";
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

async function waitForMinimumDuration(startedAt: number, minimumMs = 300) {
  const remaining = minimumMs - (Date.now() - startedAt);
  if (remaining > 0) await new Promise((resolve) => setTimeout(resolve, remaining));
}

export class AuthService {
  private createSession(user: AuthenticatedUser, tokenVersion: number) {
    const token = jwt.sign({ role: user.role, email: user.email, version: tokenVersion }, env.JWT_SECRET, {
      subject: user.id,
      expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
      issuer: "porto-agenda-api",
    });
    return { token, user };
  }

  async login(email: string, password: string) {
    const user = await authRepository.findByEmail(email);
    const passwordMatches = await compare(password, user?.passwordHash ?? LEGACY_DEMO_PASSWORD_HASH);
    if (!user || !user.active || !passwordMatches) throw new AppError(401, "E-mail ou senha inválidos");

    return this.createSession(publicUser(user), user.tokenVersion);
  }

  demoLogin() {
    if (!env.DEMO_VISITOR_ENABLED) throw new AppError(404, "Demonstração indisponível");
    return this.createSession(DEMO_VISITOR, 0);
  }

  async initializeBootstrapAdmin() {
    const passwordHash = await hash(env.DEMO_USER_PASSWORD, 12);
    return authRepository.secureSeededAdmin(env.DEMO_USER_EMAIL, passwordHash);
  }

  async authenticate(token: string) {
    try {
      const payload = jwt.verify(token, env.JWT_SECRET, { issuer: "porto-agenda-api" });
      if (typeof payload === "string" || !payload.sub) throw new Error("Token sem usuário");
      if (payload.sub === DEMO_VISITOR.id) {
        if (!env.DEMO_VISITOR_ENABLED || payload.role !== "VIEWER" || payload.version !== 0) throw new Error("Sessão de visitante inválida");
        return DEMO_VISITOR;
      }
      const user = await authRepository.findById(payload.sub);
      if (!user || !user.active || payload.version !== user.tokenVersion) throw new Error("Sessão revogada");
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
      tokenVersion: 0,
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

  async requestPasswordReset(email: string) {
    const startedAt = Date.now();
    const response = { message: "Se o e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha." };
    const user = await authRepository.findByEmail(email);
    if (!user?.active) {
      await waitForMinimumDuration(startedAt);
      return response;
    }

    const cooldownStart = new Date(Date.now() - env.PASSWORD_RESET_COOLDOWN_SECONDS * 1_000);
    if (await authRepository.hasRecentResetToken(user.id, cooldownStart)) {
      await waitForMinimumDuration(startedAt);
      return response;
    }

    const rawToken = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + env.PASSWORD_RESET_EXPIRES_MINUTES * 60_000);
    await authRepository.createResetToken({ id: createId("RST"), userId: user.id, tokenHash, expiresAt, createdAt: new Date() });

    const resetUrl = new URL("/redefinir-senha", env.FRONTEND_URL);
    resetUrl.searchParams.set("token", rawToken);
    try {
      await sendPasswordResetEmail(user.email, user.name, resetUrl.toString());
    } catch (error) {
      console.error("Falha ao enviar e-mail de recuperação", error);
    }

    await waitForMinimumDuration(startedAt);
    return env.NODE_ENV !== "production" || env.PASSWORD_RESET_EXPOSE_LINK ? { ...response, resetUrl: resetUrl.toString() } : response;
  }

  async resetPassword(token: string, password: string) {
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const changed = await authRepository.resetPassword(tokenHash, await hash(password, 12));
    if (!changed) throw new AppError(400, "O link de recuperação é inválido ou expirou");
    return { message: "Senha redefinida com sucesso. Entre novamente com sua nova senha." };
  }
}

export const authService = new AuthService();
