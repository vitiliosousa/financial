"use client";

import { useToastStore } from "@/lib/toast-store";
import { MaterialIcon } from "./material-icon";
import { cn } from "@/lib/cn";

const icons: Record<string, string> = {
  success: "check_circle",
  danger: "error",
  info: "info",
};

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div className="fixed inset-x-4 bottom-24 z-[100] flex flex-col gap-2 sm:inset-x-auto sm:bottom-4 sm:right-4 sm:w-full sm:max-w-xs">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "animate-scale-in flex items-center gap-2.5 rounded-[var(--radius-md)] px-4 py-3 text-sm text-white"
          )}
          style={{ background: "#18181b", boxShadow: "var(--shadow-2)" }}
        >
          <MaterialIcon name={icons[toast.tone]} size={18} filled className="text-[#e8c24d]" />
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
