import type {
  Answers,
  AnswersResponse,
  ExtractResponse,
  QuestionStatesResponse,
} from "../interfaces/analysis";
import type { EvaluationResult } from "../interfaces/evaluation";
import type { ProjectSpec } from "../interfaces/spec";
import { apiPost } from "./apiClient";

export function extractSpec(text: string, signal?: AbortSignal): Promise<ExtractResponse> {
  return apiPost<ExtractResponse>("/api/analysis/extract", { text }, signal);
}

export function fetchQuestionStates(spec: ProjectSpec, signal?: AbortSignal): Promise<QuestionStatesResponse> {
  return apiPost<QuestionStatesResponse>("/api/analysis/question-states", { spec }, signal);
}

export function submitAnswers(spec: ProjectSpec, answers: Answers, signal?: AbortSignal): Promise<AnswersResponse> {
  return apiPost<AnswersResponse>("/api/analysis/answers", { spec, answers }, signal);
}

export function evaluateSpec(spec: ProjectSpec, signal?: AbortSignal): Promise<EvaluationResult> {
  return apiPost<EvaluationResult>("/api/analysis/evaluate", { spec }, signal);
}