"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MOBILE_PRIMARY_ITEMS } from "./nav-config";
import { MaterialIcon } from "@/components/ui/material-icon";
import { TransactionFormModal } from "@/components/transactions/transaction-form-modal";
import { cn } from "@/lib/cn";

export function MobileBottomNav() {
  const pathname = usePathname();
  const [addOpen, setAddOpen] = useState(false);

  const [leftItems, rightItems] = [MOBILE_PRIMARY_ITEMS.slice(0, 2), MOBILE_PRIMARY_ITEMS.slice(2)];

  function renderItem(item: (typeof MOBILE_PRIMARY_ITEMS)[number]) {
    const active = pathname === item.href || pathname.startsWith(item.href + "/");
    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          "flex flex-1 flex-col items-center gap-1 py-2 text-[11px] font-medium transition-colors",
          active ? "text-primary-foreground" : "text-primary-foreground/45"
        )}
      >
        <MaterialIcon name={item.icon} size={21} filled={active} />
        {item.shortLabel ?? item.label}
      </Link>
    );
  }

  return (
    <>
      <nav
        className="fixed inset-x-4 z-40 flex items-center justify-around rounded-full bg-primary px-2 shadow-[var(--shadow-2)] lg:hidden"
        style={{ bottom: "calc(1rem + env(safe-area-inset-bottom))", height: "60px" }}
      >
        {leftItems.map(renderItem)}

        <div className="flex flex-1 items-center justify-center">
          <button
            onClick={() => setAddOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#8fae6b] text-white transition-transform active:scale-95"
            aria-label="Nova transação"
          >
            <MaterialIcon name="add" size={24} />
          </button>
        </div>

        {rightItems.map(renderItem)}
      </nav>
      <TransactionFormModal open={addOpen} onClose={() => setAddOpen(false)} />
    </>
  );
}
