"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { NAV_ITEMS, SETTINGS_ITEM } from "./nav-config";
import { MaterialIcon } from "@/components/ui/material-icon";

function NavLink({ item, active }: { item: (typeof NAV_ITEMS)[number]; active: boolean }) {
  return (
    <Link
      href={item.href}
      className={cn(
        "group flex items-center gap-2.5 rounded-[var(--radius-sm)] px-3 py-2 text-sm transition-colors",
        active
          ? "bg-surface-hover font-medium text-foreground"
          : "text-muted-foreground font-normal hover:bg-surface-hover hover:text-foreground"
      )}
    >
      <MaterialIcon name={item.icon} size={18} />
      {item.label}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden shrink-0 border-r border-border lg:block">
      <div className="sticky top-0 flex h-screen w-56 flex-col bg-sidebar-bg p-3">
        <div className="flex items-center gap-2.5 px-2 py-4">
          <div className="flex h-6 w-6 items-center justify-center rounded-[var(--radius-sm)] bg-primary text-primary-foreground">
            <MaterialIcon name="bolt" size={14} filled />
          </div>
          <p className="text-sm font-semibold leading-tight text-foreground">Finanças</p>
        </div>

        <nav className="mt-3 flex-1 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.href} item={item} active={pathname === item.href || pathname.startsWith(item.href + "/")} />
          ))}
        </nav>

        <div className="space-y-0.5 border-t border-border pt-2">
          <NavLink item={SETTINGS_ITEM} active={pathname === SETTINGS_ITEM.href} />
          <Link
            href="/login"
            className="flex items-center gap-2.5 rounded-[var(--radius-sm)] px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
          >
            <MaterialIcon name="logout" size={18} />
            Terminar sessão
          </Link>
        </div>
      </div>
    </aside>
  );
}
