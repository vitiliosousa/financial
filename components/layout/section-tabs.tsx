import { RouteTabs, type RouteTab } from "@/components/ui/route-tabs";

const ACCOUNTS_TABS: RouteTab[] = [
  { href: "/accounts", label: "Contas", icon: "account_balance_wallet" },
  { href: "/loans", label: "Empréstimos", icon: "handshake" },
];

const PLANNING_TABS: RouteTab[] = [
  { href: "/budgets", label: "Orçamentos", icon: "savings" },
  { href: "/goals", label: "Metas", icon: "flag" },
];

export function AccountsTabs() {
  return <RouteTabs tabs={ACCOUNTS_TABS} />;
}

export function PlanningTabs() {
  return <RouteTabs tabs={PLANNING_TABS} />;
}
