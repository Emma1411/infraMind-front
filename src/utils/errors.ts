import { ApiError } from "../services/apiClient";

export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

export function toMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (isAbortError(error)) return "La requête a été annulée.";
  if (error instanceof Error && error.message) return error.message;
  return "Une erreur inattendue est survenue.";
}

/** Message à afficher pour une action « rejected » de createAsyncThunk. */
export function rejectedMessage(action: { payload?: unknown; error: { message?: string } }): string {
  if (typeof action.payload === "string" && action.payload) return action.payload;
  return action.error.message ?? "Une erreur inattendue est survenue.";
}