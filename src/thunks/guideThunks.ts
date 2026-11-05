import { createAsyncThunk } from "@reduxjs/toolkit";
import type { GuideResponse } from "../interfaces/guide";
import type { ProjectSpec } from "../interfaces/spec";
import type { LoadStatus } from "../interfaces/state";
import { fetchAvailableGuides, fetchGuide } from "../services/guideService";
import { isAbortError, toMessage } from "../utils/errors";

interface GuideAware {
  guide: { status: Record<string, LoadStatus> };
}

export const loadAvailableGuides = createAsyncThunk<string[], void, { rejectValue: string }>(
  "guide/loadAvailable",
  async (_, { signal, rejectWithValue }) => {
    try {
      return await fetchAvailableGuides(signal);
    } catch (error) {
      if (isAbortError(error)) throw error;
      return rejectWithValue(toMessage(error));
    }
  },
);

export interface LoadGuideArgs {
  archId: string;
  spec: ProjectSpec;
}

export const loadGuide = createAsyncThunk<GuideResponse, LoadGuideArgs, { rejectValue: string; state: GuideAware }>(
  "guide/load",
  async ({ archId, spec }, { signal, rejectWithValue }) => {
    try {
      return await fetchGuide(archId, spec, signal);
    } catch (error) {
      if (isAbortError(error)) throw error;
      return rejectWithValue(toMessage(error));
    }
  },
  // Un guide déjà en cours de chargement n'est pas redemandé
  { condition: ({ archId }, { getState }) => getState().guide.status[archId] !== "loading" },
);