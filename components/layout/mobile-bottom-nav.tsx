"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MOBILE_NAV_ENTRIES, type MobileNavLink } from "./nav-config";
import { MaterialIcon } from "@/components/ui/material-icon";
import { NavLinkIcon } from "@/components/ui/nav-link-icon";
import { TransactionFormModal } from "@/components/transactions/transaction-form-modal";
import { cn } from "@/lib/cn";

export function MobileBottomNav() {
  const pathname = usePathname();
  const [addOpen, setAddOpen] = useState(false);

  const [leftEntries, rightEntries] = [MOBILE_NAV_ENTRIES.slice(0, 2), MOBILE_NAV_ENTRIES.slice(2)];

  function renderEntry(entry: MobileNavLink) {
    const active = entry.matches.some((m) => pathname === m || pathname.startsWith(m + "/"));
    return (
      <Link
        key={entry.href}
        href={entry.href}
        aria-current={active ? "page" : undefined}
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

      <TransactionFormModal open={addOpen} onClose={() => setAddOpen(false)} />
    </>
  );
}
