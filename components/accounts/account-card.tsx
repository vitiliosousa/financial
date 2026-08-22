import Link from "next/link";
import type { Account } from "@/lib/types";
import { formatCurrency } from "@/lib/format";
import { Card } from "@/components/ui/card";
import { IconBadge } from "@/components/ui/icon-badge";
import { MaterialIcon } from "@/components/ui/material-icon";

const TYPE_LABELS: Record<Account["type"], string> = {
  wallet: "Carteira",
  bank: "Conta Bancária",
  "mobile-money": "Dinheiro Móvel",
  other: "Outro",
};

export function AccountCard({
  account,
  balance,
  onEdit,
  onDelete,
}: {
  account: Account;
  balance: number;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Link href={`/transactions?accountId=${account.id}`} className="block">
      <Card className="p-5 transition-colors hover:bg-surface-hover">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <IconBadge icon={account.icon} color={account.color} size="md" />
            <div>
              <p className="text-sm font-medium text-foreground">{account.name}</p>
              <p className="text-xs text-muted-foreground">{TYPE_LABELS[account.type]}</p>
            </div>
          </div>
          <div className="flex gap-1">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit();
              }}
              className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
              aria-label="Editar conta"
            >
              <MaterialIcon name="edit" size={15} />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete();
              }}
              className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] text-muted-foreground transition-colors hover:bg-danger-soft hover:text-danger"
              aria-label="Eliminar conta"
            >
              <MaterialIcon name="delete" size={15} />
            </button>
          </div>
        </div>

        <div className="mt-5 border-t border-border pt-4">
          <p className="text-xs text-muted-foreground">Saldo atual</p>
          <p
            className="font-tabular mt-1 text-2xl font-semibold tracking-tight"
            style={{ color: balance < 0 ? "var(--danger)" : "var(--foreground)" }}
          >
            {formatCurrency(balance)}
          </p>
        </div>
      </Card>
    </Link>
  );
}
