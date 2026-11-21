"use client";

export type ToastType = "error" | "success" | "info";
export type ToastItem = { id: number; message: string; type: ToastType };

type Listener = (toasts: ToastItem[]) => void;

let toasts: ToastItem[] = [];
const listeners = new Set<Listener>();
let nextId = 1;

function emit() {
  for (const listener of listeners) listener(toasts);
}

export function subscribeToasts(listener: Listener) {
  listeners.add(listener);
  listener(toasts);
  return () => {
    listeners.delete(listener);
  };
}

export function dismissToast(id: number) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

export function showToast(message: string, type: ToastType = "info", duration = 5000) {
  const text = (message || "").trim();
  if (!text) return 0;
  const id = nextId++;
  toasts = [...toasts, { id, message: text, type }];
  emit();
  if (duration > 0) {
    setTimeout(() => dismissToast(id), duration);
  }
  return id;
}

/** Simple app-wide notifications. */
export const toast = {
  error: (message: string) => showToast(message, "error", 6000),
  success: (message: string) => showToast(message, "success", 4000),
  info: (message: string) => showToast(message, "info", 4000),
};
