export interface NavItem {
  label: string;
  shortLabel?: string;
  href: string;
  icon: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", shortLabel: "Início", href: "/dashboard", icon: "space_dashboard" },
  { label: "Contas", href: "/accounts", icon: "account_balance_wallet" },
  { label: "Categorias", href: "/categories", icon: "sell" },
  { label: "Transações", href: "/transactions", icon: "sync_alt" },
  { label: "Orçamentos", href: "/budgets", icon: "savings" },
  { label: "Metas", href: "/goals", icon: "flag" },
  { label: "Relatórios", href: "/reports", icon: "monitoring" },
];

export const SETTINGS_ITEM: NavItem = {
  label: "Perfil e Definições",
  href: "/settings",
  icon: "settings",
};

export interface NavGroupOption {
  href: string;
  label: string;
  icon: string;
}

export interface MobileNavLink {
  type: "link";
  href: string;
  label: string;
  icon: string;
}

export interface MobileNavGroup {
  type: "group";
  label: string;
  icon: string;
  options: NavGroupOption[];
}

export type MobileNavEntry = MobileNavLink | MobileNavGroup;

// Bottom nav on mobile only has room for a handful of items. Dashboard and
// Relatórios are direct links; the rest are grouped by context behind a
// bottom sheet the user picks from — "Movimento" (Contas, Transações —
// Recorrentes is already one tab away from Transações, so it doesn't need
// its own entry here) and "Planeamento" (Categorias, Orçamentos, Metas) —
// rather than being merged into one another as tabs. The four entries
// split two-and-two around the centered "+" quick-add button.
export const MOBILE_NAV_ENTRIES: MobileNavEntry[] = [
  { type: "link", href: "/dashboard", label: "Início", icon: "space_dashboard" },
  {
    type: "group",
    label: "Movimento",
    icon: "sync_alt",
    options: [
      { href: "/accounts", label: "Contas", icon: "account_balance_wallet" },
      { href: "/transactions", label: "Transações", icon: "sync_alt" },
    ],
  },
  {
    type: "group",
    label: "Planeamento",
    icon: "savings",
    options: [
      { href: "/categories", label: "Categorias", icon: "sell" },
      { href: "/budgets", label: "Orçamentos", icon: "savings" },
      { href: "/goals", label: "Metas", icon: "flag" },
    ],
  },
  { type: "link", href: "/reports", label: "Relatórios", icon: "monitoring" },
];

// Only Settings isn't reachable from the bottom nav at all (it lives behind
// the header avatar), so it's the only page that gets a back arrow. The
// bottom nav's own "Início" button is always visible everywhere else.
export const SECONDARY_HREFS = ["/settings"];
