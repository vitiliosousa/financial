"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MaterialIcon } from "@/components/ui/material-icon";
import { cn } from "@/lib/cn";

const TABS = [
  { href: "/transactions", label: "Transações", icon: "sync_alt" },
  { href: "/transactions/recurring", label: "Recorrentes", icon: "autorenew" },
] as const;

export function TransactionsTabs() {
  const pathname = usePathname();
  return (
    <div className="flex w-full gap-1 rounded-[var(--radius-md)] border border-border bg-surface p-1 sm:w-fit">
      {TABS.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 rounded-[var(--radius-sm)] px-3 py-1.5 text-sm font-medium transition-colors sm:flex-none",
            pathname === tab.href ? "bg-primary-soft text-foreground" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <MaterialIcon name={tab.icon} size={16} />
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
