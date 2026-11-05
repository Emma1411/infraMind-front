import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AnswerValue, Answers, QuestionState } from "../interfaces/analysis";
import { analyzeProject, saveAnswers } from "../thunks/analysisThunks";
import { draftKey } from "../utils/questions";

interface QuestionsState {
  items: QuestionState[];
  /** Ce que l'utilisateur a saisi ou modifié. « unknown » veut dire « je ne sais pas ». */
  draft: Answers;
  /** Empreinte des dernières réponses envoyées au serveur. */
  lastSavedDraft: string | null;
}

const initialState: QuestionsState = { items: [], draft: {}, lastSavedDraft: null };

const questionsSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    setAnswer(state, action: PayloadAction<{ path: string; value: AnswerValue }>) {
      state.draft[action.payload.path] = action.payload.value;
    },
    removeAnswer(state, action: PayloadAction<string>) {
      delete state.draft[action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(analyzeProject.fulfilled, (state, action) => {
        state.items = action.payload.questions.questions;
        state.draft = {};
        state.lastSavedDraft = null;
      })
      .addCase(saveAnswers.fulfilled, (state, action) => {
        state.lastSavedDraft = draftKey(action.meta.arg.answers);
      });
  },
});

export const { setAnswer, removeAnswer } = questionsSlice.actions;
export default questionsSlice.reducer;