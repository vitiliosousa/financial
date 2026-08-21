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
          active ? "text-foreground" : "text-muted-foreground"
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
        className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-border bg-sidebar-bg px-2 pb-[env(safe-area-inset-bottom)] lg:hidden"
        style={{ height: "calc(60px + env(safe-area-inset-bottom))" }}
      >
        {leftItems.map(renderItem)}

        <div className="flex flex-1 items-center justify-center">
          <button
            onClick={() => setAddOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform active:scale-95"
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
