"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/cn";
import { NAV_ITEMS, SETTINGS_ITEM } from "./nav-config";
import { MaterialIcon } from "@/components/ui/material-icon";
import { Logo } from "@/components/ui/logo";

function NavLink({ item, active }: { item: (typeof NAV_ITEMS)[number]; active: boolean }) {
  return (
    <Link
      href={item.href}
      className={cn(
        "group flex items-center gap-2.5 rounded-[var(--radius-sm)] px-3 py-2 text-sm transition-colors",
        active
          ? "bg-nav-fg/10 font-medium text-nav-fg"
          : "text-nav-fg/55 font-normal hover:bg-nav-fg/10 hover:text-nav-fg"
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
    <aside className="hidden shrink-0 lg:block lg:w-56">
      <div className="fixed inset-y-0 left-0 flex w-56 flex-col bg-nav-bg p-3">
        <div className="flex items-center gap-2 px-2 py-4">
          <Logo width={22} height={18} className="text-nav-fg" />
          <p className="text-sm font-semibold leading-tight text-nav-fg">Onazi</p>
        </div>

        <nav className="mt-3 flex-1 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.href} item={item} active={pathname === item.href || pathname.startsWith(item.href + "/")} />
          ))}
        </nav>

        <div className="space-y-0.5 border-t border-nav-fg/10 pt-2">
          <NavLink item={SETTINGS_ITEM} active={pathname === SETTINGS_ITEM.href} />
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex w-full items-center gap-2.5 rounded-[var(--radius-sm)] px-3 py-2 text-sm text-nav-fg/55 transition-colors hover:bg-nav-fg/10 hover:text-nav-fg"
          >
            <MaterialIcon name="logout" size={18} />
            Terminar sessão
          </button>
        </div>
      </div>
    </aside>
  );
}
