export interface ArchNote {
  arch_id: string;
  text: string;
}

export interface Report {
  summary: string;
  why_this_one: string[];
  why_not_others: ArchNote[];
  watch_out: string[];
  next_steps: string[];
}

export type ReportFallbackReason = "not_configured" | "service_error" | "invalid_output" | "no_recommendation";

export interface ReportResponse {
  recommended_id: string | null;
  /** « ai » : texte rédigé par l'IA et validé ; « template » : texte de secours écrit par du code. */
  source: "ai" | "template";
  fallback_reason: ReportFallbackReason | null;
  report: Report;
}