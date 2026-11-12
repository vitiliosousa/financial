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
  { label: "Empréstimos", href: "/loans", icon: "handshake" },
  { label: "Relatórios", href: "/reports", icon: "monitoring" },
];

export const SETTINGS_ITEM: NavItem = {
  label: "Perfil e Definições",
  href: "/settings",
  icon: "settings",
};

export interface MobileNavLink {
  href: string;
  label: string;
  icon: string;
  // Other routes that belong to the same tab (shown as tabs inside the page).
  matches: string[];
}

// Five slots around the centered "+" button. Every slot is a real page —
// secondary destinations live as tabs inside it (Contas | Empréstimos,
// Orçamentos | Metas, Transações | Recorrentes | Categorias) instead of
// behind a sheet. Relatórios is reached from the topbar and the dashboard.
export const MOBILE_NAV_ENTRIES: MobileNavLink[] = [
  { href: "/dashboard", label: "Início", icon: "space_dashboard", matches: ["/dashboard"] },
  {
    href: "/transactions",
    label: "Transações",
    icon: "sync_alt",
    matches: ["/transactions", "/categories"],
  },
  { href: "/accounts", label: "Contas", icon: "account_balance_wallet", matches: ["/accounts", "/loans"] },
  { href: "/budgets", label: "Planeamento", icon: "flag", matches: ["/budgets", "/goals"] },
];

// Settings (header avatar) and Relatórios (header icon) aren't in the bottom
// nav, so they get a back arrow. The
// bottom nav's own "Início" button is always visible everywhere else.
export const SECONDARY_HREFS = ["/settings", "/reports"];
