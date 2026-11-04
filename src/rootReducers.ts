import { combineReducers, type UnknownAction } from "@reduxjs/toolkit";
import guideReducer from "./slices/guideSlice";
import projectReducer from "./slices/projectSlice";
import questionsReducer from "./slices/questionsSlice";
import { resetAll } from "./slices/resetAll";
import resultsReducer from "./slices/resultsSlice";

const appReducer = combineReducers({
  project: projectReducer,
  questions: questionsReducer,
  results: resultsReducer,
  guide: guideReducer,
});

export type AppState = ReturnType<typeof appReducer>;

/** « resetAll » repart d'un état vide dans tous les slices à la fois. */
export function rootReducer(state: AppState | undefined, action: UnknownAction): AppState {
  return appReducer(resetAll.match(action) ? undefined : state, action);
}