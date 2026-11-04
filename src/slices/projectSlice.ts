import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { DomainStatusMap } from "../interfaces/analysis";
import type { ProjectSpec } from "../interfaces/spec";
import type { LoadStatus } from "../interfaces/state";
import { analyzeProject, saveAnswers } from "../thunks/analysisThunks";
import { rejectedMessage } from "../utils/errors";

interface ProjectState {
  rawText: string;
  /** Résultat de l'extraction : point de départ de toutes les réponses. */
  baseSpec: ProjectSpec | null;
  /** baseSpec plus les réponses : c'est lui qu'on envoie pour évaluer. */
  spec: ProjectSpec | null;
  missing: string[];
  domainStatus: DomainStatusMap;
  secretsMasked: boolean;
  status: LoadStatus;
  error: string | null;
  answersStatus: LoadStatus;
  answersError: string | null;
}

const initialState: ProjectState = {
  rawText: "",
  baseSpec: null,
  spec: null,
  missing: [],
  domainStatus: {},
  secretsMasked: false,
  status: "idle",
  error: null,
  answersStatus: "idle",
  answersError: null,
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setRawText(state, action: PayloadAction<string>) {
      state.rawText = action.payload;
    },
    setProjectName(state, action: PayloadAction<string>) {
      const name = action.payload.trim() || null;
      if (state.baseSpec) state.baseSpec.name = name;
      if (state.spec) state.spec.name = name;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(analyzeProject.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(analyzeProject.fulfilled, (state, action) => {
        const { extract } = action.payload;
        state.status = "succeeded";
        state.baseSpec = extract.spec;
        state.spec = extract.spec;
        state.missing = extract.missing;
        state.domainStatus = extract.domain_status;
        state.secretsMasked = extract.secrets_masked;
        state.answersStatus = "idle";
        state.answersError = null;
      })
      .addCase(analyzeProject.rejected, (state, action) => {
        if (action.meta.aborted) {
          state.status = "idle";
          return;
        }
        state.status = "failed";
        state.error = rejectedMessage(action);
      })
      .addCase(saveAnswers.pending, (state) => {
        state.answersStatus = "loading";
        state.answersError = null;
      })
      .addCase(saveAnswers.fulfilled, (state, action) => {
        state.answersStatus = "succeeded";
        state.spec = action.payload.spec;
        state.missing = action.payload.missing;
        state.domainStatus = action.payload.domain_status;
      })
      .addCase(saveAnswers.rejected, (state, action) => {
        if (action.meta.aborted) {
          state.answersStatus = "idle";
          return;
        }
        state.answersStatus = "failed";
        state.answersError = rejectedMessage(action);
      });
  },
});

export const { setRawText, setProjectName } = projectSlice.actions;
export default projectSlice.reducer;