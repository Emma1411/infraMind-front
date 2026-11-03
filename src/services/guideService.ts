import type { GuideResponse } from "../interfaces/guide";
import type { ProjectSpec } from "../interfaces/spec";
import { apiGet, apiPost } from "./apiClient";

export function fetchAvailableGuides(signal?: AbortSignal): Promise<string[]> {
  return apiGet<string[]>("/api/guides/available", signal);
}

export function fetchGuide(archId: string, spec: ProjectSpec, signal?: AbortSignal): Promise<GuideResponse> {
  return apiPost<GuideResponse>(`/api/guides/${encodeURIComponent(archId)}`, { spec }, signal);
}