"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTheme } from "@/components/theme-provider";
import { useFinanceStore } from "@/lib/store";
import { NAV_ITEMS, SECONDARY_HREFS, SETTINGS_ITEM } from "./nav-config";
import { Button } from "@/components/ui/button";
import { MaterialIcon } from "@/components/ui/material-icon";
import { NavLinkIcon } from "@/components/ui/nav-link-icon";

function pageTitle(pathname: string): string {
  const all = [...NAV_ITEMS, SETTINGS_ITEM];
  const match = all.find((item) => pathname === item.href || pathname.startsWith(item.href + "/"));
  return match?.label ?? "Onazi";
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
  const isSettings = pathname === "/settings";
  const isSecondary = SECONDARY_HREFS.some((href) => pathname === href || pathname.startsWith(href + "/"));
  const firstName = user.name.split(" ")[0];

  return (
    <header className="flex h-14 items-center justify-between gap-4 border-b border-border px-4 sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-1">
        {isSecondary && (
          <Link
            href="/dashboard"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground lg:hidden"
            aria-label="Voltar ao dashboard"
          >
            <NavLinkIcon name="arrow_back" size={20} />
          </Link>
        )}
        <h1 className="truncate text-lg font-semibold tracking-tight text-foreground">
          {isDashboard ? `Olá, ${firstName}!` : pageTitle(pathname)}
        </h1>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:bg-surface-hover hover:text-foreground"
          onClick={toggleTheme}
          aria-label="Alternar tema"
        >
          <MaterialIcon name={theme === "dark" ? "light_mode" : "dark_mode"} size={19} />
        </Button>
        {!isSettings && (
          <Link
            href="/settings"
            className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white"
            style={{ background: user.avatarColor }}
            aria-label="Perfil e definições"
          >
            {initials}
          </Link>
        )}
      </div>
    </header>
  );
}
