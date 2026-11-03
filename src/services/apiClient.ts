const BASE_URL = (import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000").replace(/\/$/, "");
const API_KEY = import.meta.env.VITE_API_KEY ?? "";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function readableDetail(detail: unknown): string | null {
  return typeof detail === "string" && detail.trim() ? detail : null;
}

function messageFor(status: number, detail: unknown): string {
  const text = readableDetail(detail);
  switch (status) {
    case 401:
      return "Accès refusé : la clé d'API du site est absente ou invalide.";
    case 400:
    case 404:
    case 413:
      return text ?? "La demande n'est pas valide.";
    case 422:
      return text ?? "Certaines informations envoyées ne sont pas valides.";
    case 502:
    case 503:
      return text ?? "Le service est momentanément indisponible. Réessaie dans un instant.";
    default:
      return status >= 500
        ? "Une erreur est survenue côté serveur. Réessaie dans un instant."
        : (text ?? "La demande a échoué.");
  }
}

interface RequestOptions {
  method: "GET" | "POST";
  body?: unknown;
  signal?: AbortSignal;
}

async function request<T>(path: string, { method, body, signal }: RequestOptions): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (API_KEY) headers["X-API-Key"] = API_KEY;

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
  } catch (error) {
    // Une requête annulée volontairement n'est pas une erreur réseau
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new ApiError(0, "Impossible de joindre le serveur. Vérifie ta connexion et réessaie.");
  }

  if (!response.ok) {
    let detail: unknown = null;
    try {
      detail = ((await response.json()) as { detail?: unknown }).detail;
    } catch {
      detail = null;
    }
    throw new ApiError(response.status, messageFor(response.status, detail));
  }

  return (await response.json()) as T;
}

export function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  return request<T>(path, { method: "GET", signal });
}

export function apiPost<T>(path: string, body: unknown, signal?: AbortSignal): Promise<T> {
  return request<T>(path, { method: "POST", body, signal });
}