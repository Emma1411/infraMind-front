import type { DomainKey, ProjectSpec } from "./spec";

export type QuestionType = "single_choice" | "multi_choice" | "boolean" | "number";

export interface QuestionOption {
  value: string;
  label: string;
}

export interface Question {
  /** Chemin « domaine.champ », par exemple « traffic.daily_users ». */
  path: string;
  domain: DomainKey;
  type: QuestionType;
  text: string;
  why: string;
  options: QuestionOption[];
  /** 1 = essentielle, 2 = détail. */
  priority: number;
  allow_unknown: boolean;
}

export type DomainStatus = "complete" | "partial" | "missing";
export type DomainStatusMap = Record<string, DomainStatus>;

export interface ExtractResponse {
  spec: ProjectSpec;
  missing: string[];
  domain_status: DomainStatusMap;
  secrets_masked: boolean;
}

export interface QuestionsResponse {
  questions: Question[];
  domain_status: DomainStatusMap;
}

/** Valeur envoyée pour une réponse : « unknown » signifie « je ne sais pas ». */
export type AnswerValue = string | number | boolean | string[];
export type Answers = Record<string, AnswerValue>;

export const UNKNOWN_ANSWER = "unknown";

export interface AnswersResponse {
  spec: ProjectSpec;
  missing: string[];
  domain_status: DomainStatusMap;
  is_complete: boolean;
}