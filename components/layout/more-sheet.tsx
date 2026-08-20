"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFinanceStore } from "@/lib/store";
import { MOBILE_MORE_ITEMS } from "./nav-config";
import { MaterialIcon } from "@/components/ui/material-icon";
import { cn } from "@/lib/cn";

export function MoreSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const user = useFinanceStore((s) => s.user);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end lg:hidden">
      <div className="absolute inset-0 bg-[#0a0a0b]/50 animate-fade-in" onClick={onClose} />
      <div
        className="relative w-full animate-slide-up rounded-t-2xl border-t border-border bg-surface p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]"
        style={{ boxShadow: "var(--shadow-2)" }}
      >
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-border" />

        <Link
          href="/settings"
          onClick={onClose}
          className="mb-2 flex items-center gap-3 rounded-[var(--radius-md)] bg-surface-hover px-4 py-3"
        >
          <div
            className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ background: user.avatarColor }}
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
          <MaterialIcon name="chevron_right" size={20} className="text-muted-foreground" />
        </Link>

        <div className="space-y-1">
          {MOBILE_MORE_ITEMS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-[var(--radius-md)] px-4 py-3 text-sm font-medium transition-colors",
                  active ? "bg-accent-soft text-accent" : "text-foreground hover:bg-surface-hover"
                )}
              >
                <MaterialIcon name={item.icon} size={20} filled={active} />
                {item.label}
              </Link>
            );
          })}

          <Link
            href="/login"
            onClick={onClose}
            className="flex items-center gap-3 rounded-[var(--radius-md)] px-4 py-3 text-sm font-medium text-danger transition-colors hover:bg-danger-soft"
          >
            <MaterialIcon name="logout" size={20} />
            Terminar sessão
          </Link>
        </div>
      </div>
    </div>,
    document.body
  );
}
