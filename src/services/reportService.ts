import type { ProjectSpec } from "../interfaces/spec";
import type { ReportResponse } from "../interfaces/report";
import { apiPost } from "./apiClient";

export function fetchReport(spec: ProjectSpec, signal?: AbortSignal): Promise<ReportResponse> {
  return apiPost<ReportResponse>("/api/report", { spec }, signal);
}