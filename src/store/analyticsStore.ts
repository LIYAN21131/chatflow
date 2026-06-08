"use client";

import { create } from "zustand";
import { STORAGE_KEYS } from "@/constants/config";
import { readStorage, writeStorage } from "@/lib/storage";

type AnalyticsState = {
  analysisCount: number;
  analysisSuccessCount: number;
  createdTaskCount: number;
};

type AnalyticsStore = AnalyticsState & {
  hydrated: boolean;
  hydrate: () => void;
  recordAnalysis: (success: boolean) => void;
  recordAnalysisSuccess: () => void;
  recordCreatedTasks: (count: number) => void;
};

const defaultAnalytics: AnalyticsState = {
  analysisCount: 0,
  analysisSuccessCount: 0,
  createdTaskCount: 0,
};

function persistAnalytics(state: AnalyticsState) {
  writeStorage(STORAGE_KEYS.analytics, state);
}

export const useAnalyticsStore = create<AnalyticsStore>((set, get) => ({
  ...defaultAnalytics,
  hydrated: false,

  hydrate() {
    if (get().hydrated) return;
    set({
      ...readStorage<AnalyticsState>(STORAGE_KEYS.analytics, defaultAnalytics),
      hydrated: true,
    });
  },

  recordAnalysis(success) {
    const next = {
      analysisCount: get().analysisCount + 1,
      analysisSuccessCount: get().analysisSuccessCount + (success ? 1 : 0),
      createdTaskCount: get().createdTaskCount,
    };
    persistAnalytics(next);
    set(next);
  },

  recordAnalysisSuccess() {
    const next = {
      analysisCount: get().analysisCount,
      analysisSuccessCount: get().analysisSuccessCount + 1,
      createdTaskCount: get().createdTaskCount,
    };
    persistAnalytics(next);
    set(next);
  },

  recordCreatedTasks(count) {
    const next = {
      analysisCount: get().analysisCount,
      analysisSuccessCount: get().analysisSuccessCount,
      createdTaskCount: get().createdTaskCount + count,
    };
    persistAnalytics(next);
    set(next);
  },
}));
