import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { GuideResponse } from "../interfaces/guide";
import type { LoadStatus } from "../interfaces/state";
import { loadAvailableGuides, loadGuide } from "../thunks/guideThunks";
import { rejectedMessage } from "../utils/errors";
import { analyzeProject, saveAnswers } from "../thunks/analysisThunks";

interface GuideState {
  available: string[];
  availableStatus: LoadStatus;
  /** Guides déjà chargés, par identifiant d'architecture. */
  byArch: Record<string, GuideResponse>;
  status: Record<string, LoadStatus>;
  errors: Record<string, string | null>;
  /** Étapes cochées « faites », par architecture. Conservées si les guides sont rechargés. */
  done: Record<string, string[]>;
}

const initialState: GuideState = {
  available: [],
  availableStatus: "idle",
  byArch: {},
  status: {},
  errors: {},
  done: {},
};

const guideSlice = createSlice({
  name: "guide",
  initialState,
  reducers: {
    toggleStepDone(state, action: PayloadAction<{ archId: string; stepId: string }>) {
      const { archId, stepId } = action.payload;
      const current = state.done[archId] ?? [];
      state.done[archId] = current.includes(stepId) ? current.filter((id) => id !== stepId) : [...current, stepId];
    },
  },
  extraReducers: (builder) => {
    builder
      // Les guides contiennent les valeurs du projet : de nouvelles réponses les rendent périmés
      .addCase(saveAnswers.fulfilled, (state) => {
        state.byArch = {};
        state.status = {};
        state.errors = {};
      })

      .addCase(analyzeProject.fulfilled, (state) => {
        state.byArch = {};
        state.status = {};
        state.errors = {};
        state.done = {};
      })

      .addCase(loadAvailableGuides.pending, (state) => {
        state.availableStatus = "loading";
      })
      .addCase(loadAvailableGuides.fulfilled, (state, action) => {
        state.availableStatus = "succeeded";
        state.available = action.payload;
      })
      .addCase(loadAvailableGuides.rejected, (state, action) => {
        state.availableStatus = action.meta.aborted ? "idle" : "failed";
      })

      .addCase(loadGuide.pending, (state, action) => {
        const { archId } = action.meta.arg;
        state.status[archId] = "loading";
        state.errors[archId] = null;
      })
      .addCase(loadGuide.fulfilled, (state, action) => {
        const { archId } = action.meta.arg;
        state.status[archId] = "succeeded";
        state.byArch[archId] = action.payload;
      })
      .addCase(loadGuide.rejected, (state, action) => {
        const { archId } = action.meta.arg;
        if (action.meta.aborted) {
          state.status[archId] = "idle";
          return;
        }
        state.status[archId] = "failed";
        state.errors[archId] = rejectedMessage(action);
      });
  },
});

export const { toggleStepDone } = guideSlice.actions;
export default guideSlice.reducer;