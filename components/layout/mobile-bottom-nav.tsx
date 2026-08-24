"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MOBILE_NAV_ENTRIES, type MobileNavGroup } from "./nav-config";
import { MaterialIcon } from "@/components/ui/material-icon";
import { NavLinkIcon } from "@/components/ui/nav-link-icon";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { TransactionFormModal } from "@/components/transactions/transaction-form-modal";
import { cn } from "@/lib/cn";

export function MobileBottomNav() {
  const pathname = usePathname();
  const [addOpen, setAddOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<MobileNavGroup | null>(null);
  const openGroupRef = useRef<MobileNavGroup | null>(null);
  useEffect(() => {
    openGroupRef.current = openGroup;
  }, [openGroup]);

  // Closes once the destination page actually finishes loading, instead of
  // the moment the option is tapped — so the pending spinner on the tapped
  // option has time to show while its data-heavy page loads.
  useEffect(() => {
    if (openGroupRef.current) setOpenGroup(null);
  }, [pathname]);

  const [leftEntries, rightEntries] = [MOBILE_NAV_ENTRIES.slice(0, 2), MOBILE_NAV_ENTRIES.slice(2)];

  function isGroupActive(group: MobileNavGroup) {
    return group.options.some((o) => pathname === o.href || pathname.startsWith(o.href + "/"));
  }

  function renderEntry(entry: (typeof MOBILE_NAV_ENTRIES)[number]) {
    if (entry.type === "link") {
      const active = pathname === entry.href || pathname.startsWith(entry.href + "/");
      return (
        <Link
          key={entry.href}
          href={entry.href}
          className={cn(
            "flex flex-1 flex-col items-center gap-1 py-2 text-[11px] font-medium transition-colors",
            active ? "text-nav-fg" : "text-nav-fg/45"
          )}
        >
          <NavLinkIcon name={entry.icon} size={21} filled={active} />
          {entry.label}
        </Link>
      );
    }

    const active = isGroupActive(entry);
    return (
      <button
        key={entry.label}
        type="button"
        onClick={() => setOpenGroup(entry)}
        className={cn(
          "flex flex-1 flex-col items-center gap-1 py-2 text-[11px] font-medium transition-colors",
          active ? "text-nav-fg" : "text-nav-fg/45"
        )}
      >
        <MaterialIcon name={entry.icon} size={21} filled={active} />
        {entry.label}
      </button>
    );
  }

  return (
    <>
      <nav
        className="fixed inset-x-4 z-40 flex items-center justify-around rounded-full bg-nav-bg px-2 shadow-[var(--shadow-2)] lg:hidden"
        style={{ bottom: "calc(1rem + env(safe-area-inset-bottom))", height: "60px" }}
      >
        {leftEntries.map(renderEntry)}

        <div className="flex flex-1 items-center justify-center">
          <button
            onClick={() => setAddOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-nav-fg text-nav-bg transition-transform active:scale-95"
            aria-label="Nova transação"
          >
            <MaterialIcon name="add" size={24} />
          </button>
        </div>

        {rightEntries.map(renderEntry)}
      </nav>

      <BottomSheet open={!!openGroup} onClose={() => setOpenGroup(null)} title={openGroup?.label}>
        <div className="space-y-1">
          {openGroup?.options.map((option) => {
            const active = pathname === option.href || pathname.startsWith(option.href + "/");
            return (
              <Link
                key={option.href}
                href={option.href}
                className={cn(
                  "flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-3 text-sm font-medium transition-colors",
                  active ? "bg-primary-soft text-foreground" : "text-foreground hover:bg-surface-hover"
                )}
              >
                <NavLinkIcon name={option.icon} size={20} />
                {option.label}
              </Link>
            );
          })}
        </div>
      </BottomSheet>

      <TransactionFormModal open={addOpen} onClose={() => setAddOpen(false)} />
    </>
  );
}
