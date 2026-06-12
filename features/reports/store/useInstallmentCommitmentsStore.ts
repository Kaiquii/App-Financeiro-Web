"use client";

import { create } from "zustand";

import { reportsApi } from "@/features/reports/api/reportsApi";
import type {
  InstallmentCommitmentsParams,
  InstallmentCommitmentsResponse,
} from "@/features/reports/types/report";
import { getApiErrorMessage } from "@/lib/api-errors";

type InstallmentCommitmentsState = {
  data: InstallmentCommitmentsResponse | null;
  error: string | null;
  isLoading: boolean;
  loadCommitments: (params: InstallmentCommitmentsParams) => Promise<void>;
};

export const useInstallmentCommitmentsStore =
  create<InstallmentCommitmentsState>((set) => ({
    data: null,
    error: null,
    isLoading: false,

    loadCommitments: async (params) => {
      set({ error: null, isLoading: true });

      try {
        const data = await reportsApi.getInstallmentCommitments(params);

        set({
          data,
          error: null,
          isLoading: false,
        });
      } catch (error) {
        set({
          data: null,
          error: getApiErrorMessage(
            error,
            "Não foi possível carregar os compromissos parcelados.",
          ),
          isLoading: false,
        });
      }
    },
  }));
