"use client";

import { type ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";

export function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-[#0a0a0b]/55 animate-fade-in" onClick={onClose} />
      <div
        className="relative w-full max-w-lg animate-sheet-up rounded-t-[var(--radius-lg)] border border-b-0 border-border bg-surface p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]"
        style={{ boxShadow: "var(--shadow-2)" }}
        role="dialog"
        aria-modal="true"
      >
        <div className="mx-auto mb-3 h-1 w-10 shrink-0 rounded-full bg-border" />
        {title && <h2 className="mb-2 px-1 text-sm font-semibold text-foreground">{title}</h2>}
        {children}
      </div>
    </div>,
    document.body
  );
}
