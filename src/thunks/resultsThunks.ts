import { createAsyncThunk } from "@reduxjs/toolkit";
import type { EvaluationResult } from "../interfaces/evaluation";
import type { QuoteRequest, QuoteResponse } from "../interfaces/export";
import type { ReportResponse } from "../interfaces/report";
import type { ProjectSpec } from "../interfaces/spec";
import type { LoadStatus } from "../interfaces/state";
import { evaluateSpec } from "../services/analysisService";
import { fetchQuote } from "../services/exportService";
import { fetchReport } from "../services/reportService";
import { isAbortError, toMessage } from "../utils/errors";

/** Partie du store dont ces thunks ont besoin (évite une dépendance circulaire avec RootState). */
interface ResultsAware {
  results: { evaluationStatus: LoadStatus; reportStatus: LoadStatus };
}

export const runEvaluation = createAsyncThunk<
  EvaluationResult,
  ProjectSpec,
  { rejectValue: string; state: ResultsAware }
>(
  "results/evaluate",
  async (spec, { signal, rejectWithValue }) => {
    try {
      return await evaluateSpec(spec, signal);
    } catch (error) {
      if (isAbortError(error)) throw error;
      return rejectWithValue(toMessage(error));
    }
  },
  // Un calcul déjà en cours n'est pas relancé
  { condition: (_, { getState }) => getState().results.evaluationStatus !== "loading" },
);

/** Le rapport rédigé par l'IA arrive après le résultat : l'écran n'attend pas. */
export const loadReport = createAsyncThunk<ReportResponse, ProjectSpec, { rejectValue: string; state: ResultsAware }>(
  "results/report",
  async (spec, { signal, rejectWithValue }) => {
    try {
      return await fetchReport(spec, signal);
    } catch (error) {
      if (isAbortError(error)) throw error;
      return rejectWithValue(toMessage(error));
    }
  },
  // Un appel déjà en cours n'est pas relancé : il consomme des tokens
  { condition: (_, { getState }) => getState().results.reportStatus !== "loading" },
);

export const buildQuote = createAsyncThunk<QuoteResponse, QuoteRequest, { rejectValue: string }>(
  "results/quote",
  async (request, { signal, rejectWithValue }) => {
    try {
      return await fetchQuote(request, signal);
    } catch (error) {
      if (isAbortError(error)) throw error;
      return rejectWithValue(toMessage(error));
    }
  },
);