import type { QuoteRequest, QuoteResponse } from "../interfaces/export";
import { apiPost } from "./apiClient";

export function fetchQuote(request: QuoteRequest, signal?: AbortSignal): Promise<QuoteResponse> {
  return apiPost<QuoteResponse>("/api/export/quote", request, signal);
}