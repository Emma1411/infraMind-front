import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Answers, AnswersResponse, ExtractResponse, QuestionStatesResponse } from "../interfaces/analysis";
import type { ProjectSpec } from "../interfaces/spec";
import { extractSpec, fetchQuestionStates, submitAnswers } from "../services/analysisService";
import { isAbortError, toMessage } from "../utils/errors";

export interface AnalyzeResult {
  extract: ExtractResponse;
  questions: QuestionStatesResponse;
}

/** Étape 1 : l'IA structure le texte collé, puis le moteur prépare les questions avec leurs valeurs détectées. */
export const analyzeProject = createAsyncThunk<AnalyzeResult, string, { rejectValue: string }>(
  "project/analyze",
  async (text, { signal, rejectWithValue }) => {
    try {
      const extract = await extractSpec(text, signal);
      const questions = await fetchQuestionStates(extract.spec, signal);
      return { extract, questions };
    } catch (error) {
      if (isAbortError(error)) throw error;
      return rejectWithValue(toMessage(error));
    }
  },
);

export interface SaveAnswersArgs {
  /** Le résultat de l'extraction, jamais le spec déjà modifié par des réponses précédentes. */
  baseSpec: ProjectSpec;
  /** Seulement ce que l'utilisateur a saisi ou modifié : le reste est déjà dans baseSpec. */
  answers: Answers;
}

/** Étape 2 : applique toutes les réponses du brouillon sur le spec de départ. */
export const saveAnswers = createAsyncThunk<AnswersResponse, SaveAnswersArgs, { rejectValue: string }>(
  "project/saveAnswers",
  async ({ baseSpec, answers }, { signal, rejectWithValue }) => {
    try {
      return await submitAnswers(baseSpec, answers, signal);
    } catch (error) {
      if (isAbortError(error)) throw error;
      return rejectWithValue(toMessage(error));
    }
  },
);