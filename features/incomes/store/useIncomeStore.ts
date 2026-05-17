"use client";

import { create } from "zustand";

import { incomesApi } from "@/features/incomes/api/incomesApi";
import type {
  CreateIncomeRequest,
  Income,
  UpdateIncomeRequest,
} from "@/features/incomes/types/income";
import { getApiErrorMessage } from "@/lib/api-errors";

type IncomeState = {
  error: string | null;
  incomes: Income[];
  isLoading: boolean;
  isSubmitting: boolean;
  message: string | null;
  total: number;
  clearFeedback: () => void;
  createIncome: (data: CreateIncomeRequest) => Promise<void>;
  deleteIncome: (id: number, deleteFuture: boolean) => Promise<void>;
  loadIncomes: () => Promise<void>;
  updateIncome: (id: number, data: UpdateIncomeRequest) => Promise<void>;
};

export const useIncomeStore = create<IncomeState>((set) => ({
  error: null,
  incomes: [],
  isLoading: false,
  isSubmitting: false,
  message: null,
  total: 0,

  clearFeedback: () => set({ error: null, message: null }),

  createIncome: async (data) => {
    set({ error: null, isSubmitting: true, message: null });

    try {
      const response = await incomesApi.createIncome(data);
      const listResponse = await incomesApi.getIncomes();

      set({
        incomes: listResponse.incomes,
        isSubmitting: false,
        message: response.message,
        total: listResponse.total,
      });
    } catch (error) {
      set({ error: getApiErrorMessage(error), isSubmitting: false, message: null });
      throw error;
    }
  },

  deleteIncome: async (id, deleteFuture) => {
    set({ error: null, isSubmitting: true, message: null });

    try {
      const response = await incomesApi.deleteIncome(id, deleteFuture);
      const listResponse = await incomesApi.getIncomes();

      set({
        incomes: listResponse.incomes,
        isSubmitting: false,
        message: response.message,
        total: listResponse.total,
      });
    } catch (error) {
      set({ error: getApiErrorMessage(error), isSubmitting: false, message: null });
      throw error;
    }
  },

  loadIncomes: async () => {
    set({ error: null, isLoading: true });

    try {
      const response = await incomesApi.getIncomes();

      set({
        incomes: response.incomes,
        isLoading: false,
        total: response.total,
      });
    } catch (error) {
      set({ error: getApiErrorMessage(error), isLoading: false });
    }
  },

  updateIncome: async (id, data) => {
    set({ error: null, isSubmitting: true, message: null });

    try {
      const response = await incomesApi.updateIncome(id, data);
      const listResponse = await incomesApi.getIncomes();

      set({
        incomes: listResponse.incomes,
        isSubmitting: false,
        message: response.message,
        total: listResponse.total,
      });
    } catch (error) {
      set({ error: getApiErrorMessage(error), isSubmitting: false, message: null });
      throw error;
    }
  },
}));
