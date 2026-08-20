import { formatCurrency } from "@/lib/format";
import { Card } from "@/components/ui/card";
import { MaterialIcon } from "@/components/ui/material-icon";

export function HeroBalanceCard({
  totalBalance,
  income,
  expense,
  accountsCount,
}: {
  totalBalance: number;
  income: number;
  expense: number;
  accountsCount: number;
}) {
  return (
    <Card className="flex h-full flex-col justify-between p-6">
      <div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Saldo total</p>
          <span className="rounded-[var(--radius-sm)] bg-primary-soft px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {accountsCount} {accountsCount === 1 ? "conta" : "contas"}
          </span>
        </div>

        <p className="font-tabular mt-2 text-4xl font-semibold tracking-tight text-foreground sm:text-[2.75rem]">
          {formatCurrency(totalBalance)}
        </p>
      </div>

      <div className="mt-6 flex items-center gap-6 border-t border-border pt-4">
        <div className="flex items-center gap-2">
          <MaterialIcon name="arrow_upward" size={16} className="text-success" />
          <div>
            <p className="text-[11px] text-muted-foreground">Receitas do mês</p>
            <p className="font-tabular text-sm font-medium text-foreground">{formatCurrency(income)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <MaterialIcon name="arrow_downward" size={16} className="text-danger" />
          <div>
            <p className="text-[11px] text-muted-foreground">Despesas do mês</p>
            <p className="font-tabular text-sm font-medium text-foreground">{formatCurrency(expense)}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
