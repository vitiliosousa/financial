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

// Bottom nav on mobile only has room for a handful of items; the rest live
// behind the "Mais" sheet.
export const MOBILE_PRIMARY_HREFS = ["/dashboard", "/transactions", "/budgets", "/goals"];

export const MOBILE_PRIMARY_ITEMS = NAV_ITEMS.filter((item) => MOBILE_PRIMARY_HREFS.includes(item.href));
export const MOBILE_MORE_ITEMS = [
  ...NAV_ITEMS.filter((item) => !MOBILE_PRIMARY_HREFS.includes(item.href)),
  SETTINGS_ITEM,
];
