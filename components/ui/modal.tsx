"use client";

import { type ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";
import { Button } from "./button";
import { MaterialIcon } from "./material-icon";

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0a0a0b]/55 animate-fade-in" onClick={onClose} />
      <div
        className={cn(
          "relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-[var(--radius-lg)] border border-border bg-surface p-6 animate-scale-in",
          className
        )}
        style={{ boxShadow: "var(--shadow-2)" }}
        role="dialog"
        aria-modal="true"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">{title}</h2>
            {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 -mr-2 -mt-1"
            onClick={onClose}
            aria-label="Fechar"
          >
            <MaterialIcon name="close" size={18} />
          </Button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Eliminar",
  danger = true,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  danger?: boolean;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} description={description} className="max-w-sm">
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          variant={danger ? "danger" : "primary"}
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
