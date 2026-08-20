"use client";

import { useState } from "react";
import { useFinanceStore } from "@/lib/store";
import { useToastStore } from "@/lib/toast-store";
import { formatCurrency, formatDate } from "@/lib/format";
import { parseLocalDate } from "@/lib/date";
import type { RecurrenceFrequency, RecurringTransaction } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconBadge } from "@/components/ui/icon-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmModal } from "@/components/ui/modal";
import { MaterialIcon } from "@/components/ui/material-icon";
import { RecurringFormModal } from "@/components/transactions/recurring-form-modal";
import { TransactionsTabs } from "@/components/transactions/transactions-tabs";
import { cn } from "@/lib/cn";

const FREQUENCY_LABELS: Record<RecurrenceFrequency, string> = {
  daily: "Diária",
  weekly: "Semanal",
  monthly: "Mensal",
  yearly: "Anual",
};

function nextOccurrence(rec: RecurringTransaction): Date {
  let cursor = parseLocalDate(rec.startDate);
  const today = new Date();
  while (cursor <= today) {
    if (rec.frequency === "monthly") cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, cursor.getDate());
    else if (rec.frequency === "yearly") cursor = new Date(cursor.getFullYear() + 1, cursor.getMonth(), cursor.getDate());
    else if (rec.frequency === "weekly") cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 7);
    else cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 1);
  }
  return cursor;
}

export default function RecurringTransactionsPage() {
  const { recurringTransactions, categories, accounts, deleteRecurring, updateRecurring } = useFinanceStore((s) => s);
  const showToast = useToastStore((s) => s.show);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<RecurringTransaction | undefined>(undefined);
  const [deleting, setDeleting] = useState<RecurringTransaction | undefined>(undefined);

  function openCreate() {
    setEditing(undefined);
    setFormOpen(true);
  }
  function openEdit(rec: RecurringTransaction) {
    setEditing(rec);
    setFormOpen(true);
  }

  return (
    <div className="space-y-6">
      <TransactionsTabs />

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          As transações futuras são geradas automaticamente com base na frequência definida.
        </p>
        <Button onClick={openCreate}>
          <MaterialIcon name="add" size={18} />
          Nova recorrência
        </Button>
      </div>

      {recurringTransactions.length === 0 ? (
        <EmptyState
          icon="autorenew"
          title="Sem transações recorrentes"
          description="Crie movimentos automáticos como salário, renda ou subscrições."
          action={
            <Button size="sm" onClick={openCreate}>
              <MaterialIcon name="add" size={16} />
              Nova recorrência
            </Button>
          }
        />
      ) : (
        <Card className="divide-y divide-border p-5">
          {recurringTransactions.map((rec) => {
            const category = categories.find((c) => c.id === rec.categoryId);
            const account = accounts.find((a) => a.id === rec.accountId);
            const isIncome = rec.type === "income";
            return (
              <div key={rec.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center">
                <IconBadge icon={category?.icon ?? "coins"} color={category?.color ?? "#6b7280"} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-foreground">
                      {rec.description || category?.name || "Recorrência"}
                    </p>
                    <Badge tone="neutral">{FREQUENCY_LABELS[rec.frequency]}</Badge>
                    {!rec.active && <Badge tone="warning">Inativa</Badge>}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {category?.name} &middot; {account?.name} &middot; próxima em {formatDate(nextOccurrence(rec))}
                  </p>
                </div>
                <p className={cn("shrink-0 text-sm font-medium", isIncome ? "text-success" : "text-danger")}>
                  {isIncome ? "+" : "-"}
                  {formatCurrency(rec.amount)}
                </p>
                <div className="flex shrink-0 items-center gap-1">
                  <label className="mr-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={rec.active}
                      onChange={(e) => updateRecurring(rec.id, { active: e.target.checked })}
                      className="h-3.5 w-3.5 rounded accent-[var(--accent)]"
                    />
                    Ativa
                  </label>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                    onClick={() => openEdit(rec)}
                  >
                    <MaterialIcon name="edit" size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:bg-danger-soft hover:text-danger"
                    onClick={() => setDeleting(rec)}
                  >
                    <MaterialIcon name="delete" size={16} />
                  </Button>
                </div>
              </div>
            );
          })}
        </Card>
      )}

      <RecurringFormModal open={formOpen} onClose={() => setFormOpen(false)} recurring={editing} />
      <ConfirmModal
        open={!!deleting}
        onClose={() => setDeleting(undefined)}
        title="Eliminar recorrência"
        description="As transações futuras deixarão de ser geradas. As transações já criadas mantêm-se."
        onConfirm={() => {
          if (deleting) {
            deleteRecurring(deleting.id);
            showToast("Recorrência eliminada.", "danger");
          }
        }}
      />
    </div>
  );
}
