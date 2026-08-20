"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTheme } from "@/components/theme-provider";
import { useFinanceStore } from "@/lib/store";
import { NAV_ITEMS, SETTINGS_ITEM } from "./nav-config";
import { Button } from "@/components/ui/button";
import { MaterialIcon } from "@/components/ui/material-icon";

function pageTitle(pathname: string): string {
  const all = [...NAV_ITEMS, SETTINGS_ITEM];
  const match = all.find((item) => pathname === item.href || pathname.startsWith(item.href + "/"));
  return match?.label ?? "Finanças";
}

export function Topbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const user = useFinanceStore((s) => s.user);
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const isDashboard = pathname === "/dashboard";
  const firstName = user.name.split(" ")[0];

  return (
    <header className="flex h-14 items-center justify-between gap-4 border-b border-border px-4 sm:px-6 lg:px-8">
      <h1 className="text-lg font-semibold tracking-tight text-foreground">
        {isDashboard ? `Olá, ${firstName}!` : pageTitle(pathname)}
      </h1>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:bg-surface-hover hover:text-foreground"
          onClick={toggleTheme}
          aria-label="Alternar tema"
        >
          <MaterialIcon name={theme === "dark" ? "light_mode" : "dark_mode"} size={19} />
        </Button>
        <Link
          href="/settings"
          className="hidden h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white lg:flex"
          style={{ background: user.avatarColor }}
        >
          {initials}
        </Link>
      </div>
    </header>
  );
}
