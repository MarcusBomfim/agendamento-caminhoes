import type { IncomingMessage } from "node:http";
import { env } from "../../config/env.ts";
import type { Route } from "./types.ts";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const attempts = new Map<string, RateLimitEntry>();
let operationsSinceCleanup = 0;

function clientAddress(request: IncomingMessage) {
  if (env.TRUST_PROXY) {
    const forwarded = request.headers["x-forwarded-for"];
    const firstAddress = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(",")[0];
    if (firstAddress?.trim()) return firstAddress.trim();
  }
  return request.socket.remoteAddress ?? "unknown";
}

function cleanupExpiredEntries(now: number) {
  operationsSinceCleanup += 1;
  if (operationsSinceCleanup < 500 && attempts.size < 10_000) return;
  operationsSinceCleanup = 0;
  for (const [key, entry] of attempts) if (entry.resetAt <= now) attempts.delete(key);
}

export function consumeRateLimit(request: IncomingMessage, route: Route) {
  if (!route.rateLimit) return { allowed: true, retryAfterSeconds: 0 };

  const now = Date.now();
  cleanupExpiredEntries(now);
  const key = `${route.method}:${route.path}:${clientAddress(request)}`;
  const current = attempts.get(key);

  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + route.rateLimit.windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (current.count >= route.rateLimit.limit) {
    return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1_000)) };
  }

  current.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

export function clearRateLimitStore() {
  attempts.clear();
  operationsSinceCleanup = 0;
}
