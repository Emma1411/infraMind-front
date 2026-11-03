import type { ProjectSpec } from "./spec";

export interface QuoteRequest {
  spec: ProjectSpec;
  arch_id?: string | null;
  client_name?: string | null;
  validity_days?: number;
  margin_percent?: number;
  include_alternatives?: boolean;
}

export interface QuoteResponse {
  arch_id: string;
  filename: string;
  markdown: string;
  generated_on: string;
  valid_until: string;
}