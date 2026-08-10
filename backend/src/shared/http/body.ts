import type { IncomingMessage } from "node:http";
import { AppError } from "../errors/AppError.ts";

const MAX_BODY_SIZE = 1024 * 1024;

export async function readJsonBody(request: IncomingMessage) {
  if (request.method === "GET" || request.method === "DELETE") return undefined;

  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of request) {
    const buffer = Buffer.from(chunk);
    size += buffer.length;
    if (size > MAX_BODY_SIZE) throw new AppError(413, "Corpo da requisição excede 1 MB");
    chunks.push(buffer);
  }

  if (chunks.length === 0) return undefined;
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8")) as unknown;
  } catch {
    throw new AppError(400, "JSON inválido");
  }
}
