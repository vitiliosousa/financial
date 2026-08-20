import Link from "next/link";
import { MaterialIcon } from "@/components/ui/material-icon";

const LINKS = [
  { href: "/accounts", label: "Contas", icon: "account_balance_wallet" },
  { href: "/categories", label: "Categorias", icon: "sell" },
  { href: "/reports", label: "Relatórios", icon: "monitoring" },
  { href: "/settings", label: "Definições", icon: "settings" },
] as const;

export function QuickLinks() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="flex items-center gap-2.5 rounded-[var(--radius-md)] border border-border px-3.5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover"
        >
          <MaterialIcon name={link.icon} size={18} className="text-muted-foreground" />
          {link.label}
        </Link>
      ))}
    </div>
  );
}
