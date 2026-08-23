import { RouteTabs, type RouteTab } from "@/components/ui/route-tabs";

const TABS: RouteTab[] = [
  { href: "/transactions", label: "Transações", icon: "sync_alt" },
  { href: "/transactions/recurring", label: "Recorrentes", icon: "autorenew" },
];

export function TransactionsTabs() {
  return <RouteTabs tabs={TABS} />;
}
