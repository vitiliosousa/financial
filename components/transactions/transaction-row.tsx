import type { Account, Category, Transaction } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/format";
import { IconBadge } from "@/components/ui/icon-badge";
import { cn } from "@/lib/cn";

export function TransactionRow({
  transaction,
  category,
  account,
  actions,
}: {
  transaction: Transaction;
  category?: Category;
  account?: Account;
  actions?: React.ReactNode;
}) {
  const isIncome = transaction.type === "income";
  return (
    <div className="group flex items-center gap-3 rounded-[var(--radius-md)] px-2 py-2.5 transition-colors hover:bg-surface-hover">
      <IconBadge icon={category?.icon ?? "coins"} color={category?.color ?? "#6b7280"} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          {transaction.description || category?.name || "Transação"}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {category?.name} &middot; {account?.name} &middot; {formatDate(transaction.date)}
        </p>
      </div>
      <p
        className={cn(
          "shrink-0 text-sm font-medium",
          isIncome ? "text-success" : "text-danger"
        )}
      >
        {isIncome ? "+" : "-"}
        {formatCurrency(transaction.amount)}
      </p>
      {actions && (
        <div className="flex shrink-0 items-center opacity-0 transition-opacity group-hover:opacity-100">
          {actions}
        </div>
      )}
    </div>
  );
}
