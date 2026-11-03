import type { Answers, AnswersResponse, ExtractResponse, QuestionsResponse } from "../interfaces/analysis";
import type { EvaluationResult } from "../interfaces/evaluation";
import type { ProjectSpec } from "../interfaces/spec";
import { apiPost } from "./apiClient";

export function extractSpec(text: string, signal?: AbortSignal): Promise<ExtractResponse> {
  return apiPost<ExtractResponse>("/api/analysis/extract", { text }, signal);
}

export function fetchQuestions(spec: ProjectSpec, signal?: AbortSignal): Promise<QuestionsResponse> {
  return apiPost<QuestionsResponse>("/api/analysis/questions", { spec }, signal);
}

export function submitAnswers(spec: ProjectSpec, answers: Answers, signal?: AbortSignal): Promise<AnswersResponse> {
  return apiPost<AnswersResponse>("/api/analysis/answers", { spec, answers }, signal);
}

export function evaluateSpec(spec: ProjectSpec, signal?: AbortSignal): Promise<EvaluationResult> {
  return apiPost<EvaluationResult>("/api/analysis/evaluate", { spec }, signal);
}