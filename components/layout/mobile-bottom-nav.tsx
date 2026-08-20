"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFinanceStore } from "@/lib/store";
import { MOBILE_PRIMARY_ITEMS } from "./nav-config";
import { MaterialIcon } from "@/components/ui/material-icon";
import { MoreSheet } from "./more-sheet";
import { cn } from "@/lib/cn";

export function MobileBottomNav() {
  const pathname = usePathname();
  const user = useFinanceStore((s) => s.user);
  const [moreOpen, setMoreOpen] = useState(false);

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <>
      <nav
        className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-border bg-background px-2 pb-[env(safe-area-inset-bottom)] lg:hidden"
        style={{ height: "calc(60px + env(safe-area-inset-bottom))" }}
      >
        {MOBILE_PRIMARY_ITEMS.map((item) => {
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
        })}

        <button
          onClick={() => setMoreOpen(true)}
          className="flex flex-1 flex-col items-center gap-1 py-2"
          aria-label="Mais opções"
        >
          <span
            className="flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-semibold text-white"
            style={{ background: user.avatarColor }}
          >
            {initials}
          </span>
          <span className="text-[11px] font-medium text-muted-foreground">Mais</span>
        </button>
      </nav>
      <MoreSheet open={moreOpen} onClose={() => setMoreOpen(false)} />
    </>
  );
}
