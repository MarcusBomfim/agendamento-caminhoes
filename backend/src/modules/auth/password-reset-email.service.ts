import nodemailer from "nodemailer";
import { env } from "../../config/env.ts";

const transporter = env.SMTP_HOST ? nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_SECURE,
  auth: env.SMTP_USER && env.SMTP_PASSWORD ? { user: env.SMTP_USER, pass: env.SMTP_PASSWORD } : undefined,
}) : null;

const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", "\"": "&quot;" })[character]!);

export async function sendPasswordResetEmail(email: string, name: string, resetUrl: string) {
  if (!transporter) return false;

  const safeName = escapeHtml(name);
  const safeResetUrl = escapeHtml(resetUrl);

  await transporter.sendMail({
    from: env.SMTP_FROM ?? "Porto Agenda <nao-responda@portoagenda.local>",
    to: email,
    subject: "Redefinição de senha — Porto Agenda",
    text: `Olá, ${name}. Use este link para redefinir sua senha: ${resetUrl}. O link expira em ${env.PASSWORD_RESET_EXPIRES_MINUTES} minutos e só pode ser usado uma vez.`,
    html: `<p>Olá, ${safeName}.</p><p>Recebemos uma solicitação para redefinir sua senha no Porto Agenda.</p><p><a href="${safeResetUrl}">Redefinir minha senha</a></p><p>O link expira em ${env.PASSWORD_RESET_EXPIRES_MINUTES} minutos e só pode ser usado uma vez.</p><p>Se você não solicitou a alteração, ignore esta mensagem.</p>`,
  });

  return true;
}
