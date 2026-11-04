import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { EvaluationResult } from "../interfaces/evaluation";
import type { QuoteResponse } from "../interfaces/export";
import type { ReportResponse } from "../interfaces/report";
import type { LoadStatus } from "../interfaces/state";
import { buildQuote, loadReport, runEvaluation } from "../thunks/resultsThunks";
import { rejectedMessage } from "../utils/errors";
import { analyzeProject, saveAnswers } from "../thunks/analysisThunks";

interface ResultsState {
  evaluation: EvaluationResult | null;
  evaluationStatus: LoadStatus;
  evaluationError: string | null;
  selectedArchId: string | null;
  report: ReportResponse | null;
  reportStatus: LoadStatus;
  reportError: string | null;
  quote: QuoteResponse | null;
  quoteStatus: LoadStatus;
  quoteError: string | null;
}

const initialState: ResultsState = {
  evaluation: null,
  evaluationStatus: "idle",
  evaluationError: null,
  selectedArchId: null,
  report: null,
  reportStatus: "idle",
  reportError: null,
  quote: null,
  quoteStatus: "idle",
  quoteError: null,
};

const resultsSlice = createSlice({
  name: "results",
  initialState,
  reducers: {
    selectArchitecture(state, action: PayloadAction<string>) {
      state.selectedArchId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // De nouvelles réponses rendent tous les résultats périmés
      .addCase(analyzeProject.fulfilled, () => initialState)
      .addCase(saveAnswers.fulfilled, () => initialState)

      .addCase(runEvaluation.pending, (state) => {
        state.evaluationStatus = "loading";
        state.evaluationError = null;
        state.report = null;
        state.reportStatus = "idle";
        state.reportError = null;
        state.quote = null;
        state.quoteStatus = "idle";
        state.quoteError = null;
      })
      .addCase(runEvaluation.fulfilled, (state, action) => {
        state.evaluationStatus = "succeeded";
        state.evaluation = action.payload;
        state.selectedArchId = action.payload.recommended_id ?? action.payload.ranking[0]?.id ?? null;
      })
      .addCase(runEvaluation.rejected, (state, action) => {
        if (action.meta.aborted) {
          state.evaluationStatus = "idle";
          return;
        }
        state.evaluationStatus = "failed";
        state.evaluationError = rejectedMessage(action);
      })

      .addCase(loadReport.pending, (state) => {
        state.reportStatus = "loading";
        state.reportError = null;
      })
      .addCase(loadReport.fulfilled, (state, action) => {
        state.reportStatus = "succeeded";
        state.report = action.payload;
      })
      .addCase(loadReport.rejected, (state, action) => {
        if (action.meta.aborted) {
          state.reportStatus = "idle";
          return;
        }
        state.reportStatus = "failed";
        state.reportError = rejectedMessage(action);
      })

      .addCase(buildQuote.pending, (state) => {
        state.quoteStatus = "loading";
        state.quoteError = null;
      })
      .addCase(buildQuote.fulfilled, (state, action) => {
        state.quoteStatus = "succeeded";
        state.quote = action.payload;
      })
      .addCase(buildQuote.rejected, (state, action) => {
        if (action.meta.aborted) {
          state.quoteStatus = "idle";
          return;
        }
        state.quoteStatus = "failed";
        state.quoteError = rejectedMessage(action);
      });
  },
});

export const { selectArchitecture } = resultsSlice.actions;
export default resultsSlice.reducer;