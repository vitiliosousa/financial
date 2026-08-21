"use client";

import { useState } from "react";
import Link from "next/link";
import { useFinanceStore } from "@/lib/store";
import { useToastStore } from "@/lib/toast-store";
import { getBudgetUsage } from "@/lib/calculations";
import { formatCurrency, formatFullMonthLabel } from "@/lib/format";
import type { Budget } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { IconBadge } from "@/components/ui/icon-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmModal } from "@/components/ui/modal";
import { MaterialIcon } from "@/components/ui/material-icon";
import { BudgetFormModal } from "@/components/budgets/budget-form-modal";

const STATUS_CONFIG = {
  ok: { tone: "success" as const, color: "var(--success)", label: "Dentro do limite" },
  warning: { tone: "warning" as const, color: "var(--warning)", label: "Atenção: 80%+" },
  danger: { tone: "warning" as const, color: "var(--warning)", label: "Alerta: 90%+" },
  exceeded: { tone: "danger" as const, color: "var(--danger)", label: "Limite excedido" },
};

export default function BudgetsPage() {
  const { budgets, categories, transactions, deleteBudget } = useFinanceStore((s) => s);
  const showToast = useToastStore((s) => s.show);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Budget | undefined>(undefined);
  const [deleting, setDeleting] = useState<Budget | undefined>(undefined);

  const now = new Date();
  const usage = getBudgetUsage(budgets, categories, transactions).sort((a, b) => b.percentage - a.percentage);

  const totalLimit = usage.reduce((s, u) => s + u.budget.limit, 0);
  const totalSpent = usage.reduce((s, u) => s + u.spent, 0);

  function openCreate() {
    setEditing(undefined);
    setFormOpen(true);
  }
  function openEdit(budget: Budget) {
    setEditing(budget);
    setFormOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Orçamentos de {formatFullMonthLabel(now.getMonth(), now.getFullYear())}</p>
          {totalLimit > 0 && (
            <p className="mt-1 text-sm">
              <span className="font-medium text-foreground">{formatCurrency(totalSpent)}</span>
              <span className="text-muted-foreground"> gasto de {formatCurrency(totalLimit)} orçamentado</span>
            </p>
          )}
        </div>
        <Button className="self-end sm:self-auto" onClick={openCreate}>
          <MaterialIcon name="add" size={18} />
          Novo orçamento
        </Button>
      </div>

      {usage.length === 0 ? (
        <EmptyState
          icon="savings"
          title="Sem orçamentos definidos"
          description="Defina limites mensais por categoria para controlar melhor os seus gastos."
          action={
            <Button size="sm" onClick={openCreate}>
              <MaterialIcon name="add" size={16} />
              Novo orçamento
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {usage.map((u) => {
            const config = STATUS_CONFIG[u.status];
            return (
              <Card key={u.budget.id} className="p-5 transition-colors hover:bg-surface-hover">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <IconBadge icon={u.category.icon} color={u.category.color} />
                    <span className="text-sm font-medium text-foreground">{u.category.name}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                      onClick={() => openEdit(u.budget)}
                      aria-label="Editar orçamento"
                    >
                      <MaterialIcon name="edit" size={15} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:bg-danger-soft hover:text-danger"
                      onClick={() => setDeleting(u.budget)}
                      aria-label="Eliminar orçamento"
                    >
                      <MaterialIcon name="delete" size={15} />
                    </Button>
                  </div>
                </div>

                <Link href={`/transactions?categoryId=${u.category.id}`} className="mt-4 block">
                  <div className="flex items-baseline justify-between">
                    <span className="font-tabular text-xl font-semibold text-foreground">{formatCurrency(u.spent)}</span>
                    <span className="text-xs text-muted-foreground">de {formatCurrency(u.budget.limit)}</span>
                  </div>
                  <div className="mt-2">
                    <ProgressBar value={u.percentage} color={config.color} />
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <Badge tone={config.tone}>
                      {u.status === "exceeded" && <MaterialIcon name="warning" size={12} filled />}
                      {u.percentage.toFixed(0)}%
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {u.remaining >= 0 ? `${formatCurrency(u.remaining)} restante` : `${formatCurrency(Math.abs(u.remaining))} acima`}
                    </span>
                  </div>
                </Link>
              </Card>
            );
          })}
        </div>
      )}

      <BudgetFormModal open={formOpen} onClose={() => setFormOpen(false)} budget={editing} />
      <ConfirmModal
        open={!!deleting}
        onClose={() => setDeleting(undefined)}
        title="Eliminar orçamento"
        description={`Tem a certeza que pretende eliminar o orçamento de "${deleting ? categories.find((c) => c.id === deleting.categoryId)?.name : ""}"?`}
        onConfirm={() => {
          if (deleting) {
            deleteBudget(deleting.id);
            showToast("Orçamento eliminado.", "danger");
          }
        }}
      />
    </div>
  );
}
