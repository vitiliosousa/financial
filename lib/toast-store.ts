"use client";

import { create } from "zustand";

export interface Toast {
  id: string;
  message: string;
  tone: "success" | "danger" | "info";
}

interface ToastState {
  toasts: Toast[];
  show: (message: string, tone?: Toast["tone"]) => void;
  dismiss: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  show: (message, tone = "success") =>
    set((state) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setTimeout(() => {
        useToastStore.getState().dismiss(id);
      }, 3000);
      return { toasts: [...state.toasts, { id, message, tone }] };
    }),
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
