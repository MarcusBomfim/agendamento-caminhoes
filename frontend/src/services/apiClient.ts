const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333/api";
const TOKEN_KEY = "porto-agenda:token";

interface ApiEnvelope<T> { data: T }

export class ApiError extends Error {
  readonly status: number;
  constructor(status: number, message: string) { super(message); this.name = "ApiError"; this.status = status; }
}

export function getAccessToken() { return window.localStorage.getItem(TOKEN_KEY); }
export function setAccessToken(token: string | null) { if (token) window.localStorage.setItem(TOKEN_KEY, token); else window.localStorage.removeItem(TOKEN_KEY); }

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAccessToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
  });
  const payload = await response.json().catch(() => ({})) as ApiEnvelope<T> & { error?: string };
  if (!response.ok) {
    if (response.status === 401 && token) window.dispatchEvent(new Event("porto-agenda:unauthorized"));
    throw new ApiError(response.status, payload.error ?? "Não foi possível concluir a operação");
  }
  return payload.data;
}
