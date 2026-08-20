"use client";

import { useState } from "react";
import { useFinanceStore } from "@/lib/store";
import { useToastStore } from "@/lib/toast-store";
import { getGoalProgress } from "@/lib/calculations";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Goal } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { IconBadge } from "@/components/ui/icon-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmModal } from "@/components/ui/modal";
import { MaterialIcon } from "@/components/ui/material-icon";
import { GoalFormModal } from "@/components/goals/goal-form-modal";
import { ContributeModal } from "@/components/goals/contribute-modal";

export default function GoalsPage() {
  const goals = useFinanceStore((s) => s.goals);
  const deleteGoal = useFinanceStore((s) => s.deleteGoal);
  const showToast = useToastStore((s) => s.show);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Goal | undefined>(undefined);
  const [deleting, setDeleting] = useState<Goal | undefined>(undefined);
  const [contributing, setContributing] = useState<Goal | undefined>(undefined);

  function openCreate() {
    setEditing(undefined);
    setFormOpen(true);
  }
  function openEdit(goal: Goal) {
    setEditing(goal);
    setFormOpen(true);
  }

  const progressList = goals.map((g) => getGoalProgress(g)).sort((a, b) => b.percentage - a.percentage);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Button onClick={openCreate}>
          <MaterialIcon name="add" size={18} />
          Nova meta
        </Button>
      </div>

      {progressList.length === 0 ? (
        <EmptyState
          icon="flag"
          title="Sem metas financeiras"
          description="Crie objetivos de poupança e acompanhe o seu progresso ao longo do tempo."
          action={
            <Button size="sm" onClick={openCreate}>
              <MaterialIcon name="add" size={16} />
              Nova meta
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {progressList.map((p) => (
            <Card key={p.goal.id} className="flex flex-col p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <IconBadge icon={p.goal.icon} color={p.goal.color} size="lg" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{p.goal.name}</p>
                    {p.goal.deadline && (
                      <p className="text-xs text-muted-foreground">Prazo: {formatDate(p.goal.deadline)}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                    onClick={() => openEdit(p.goal)}
                  >
                    <MaterialIcon name="edit" size={15} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:bg-danger-soft hover:text-danger"
                    onClick={() => setDeleting(p.goal)}
                  >
                    <MaterialIcon name="delete" size={15} />
                  </Button>
                </div>
              </div>

              <div className="mt-5 flex-1">
                <div className="flex items-baseline justify-between">
                  <span className="font-tabular text-xl font-semibold text-foreground">{formatCurrency(p.goal.currentAmount)}</span>
                  <span className="text-xs text-muted-foreground">de {formatCurrency(p.goal.targetAmount)}</span>
                </div>
                <div className="mt-2">
                  <ProgressBar value={p.percentage} color={p.goal.color} />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="font-medium" style={{ color: p.goal.color }}>
                    {p.percentage.toFixed(0)}%
                  </span>
                  {!p.isCompleted && <span className="text-muted-foreground">Faltam {formatCurrency(p.remaining)}</span>}
                </div>

                <div className="mt-4 rounded-[var(--radius-sm)] bg-surface-hover p-3 text-xs">
                  {p.isCompleted ? (
                    <div className="flex items-center gap-1.5 font-medium text-success">
                      <MaterialIcon name="check_circle" size={15} filled />
                      Meta concluída!
                    </div>
                  ) : (
                    <>
                      <p className="text-muted-foreground">Estimativa de conclusão</p>
                      <p className="mt-0.5 font-medium text-foreground">{p.estimatedCompletionLabel}</p>
                      {p.isOverdue && (
                        <Badge tone="danger" className="mt-1.5">
                          Prazo ultrapassado
                        </Badge>
                      )}
                    </>
                  )}
                </div>
              </div>

              {!p.isCompleted && (
                <Button variant="outline" size="sm" className="mt-4 w-full" onClick={() => setContributing(p.goal)}>
                  <MaterialIcon name="add_card" size={16} />
                  Adicionar fundos
                </Button>
              )}
            </Card>
          ))}
        </div>
      )}

      <GoalFormModal open={formOpen} onClose={() => setFormOpen(false)} goal={editing} />
      <ContributeModal open={!!contributing} onClose={() => setContributing(undefined)} goal={contributing} />
      <ConfirmModal
        open={!!deleting}
        onClose={() => setDeleting(undefined)}
        title="Eliminar meta"
        description={`Tem a certeza que pretende eliminar a meta "${deleting?.name}"?`}
        onConfirm={() => {
          if (deleting) {
            deleteGoal(deleting.id);
            showToast("Meta eliminada.", "danger");
          }
        }}
      />
    </div>
  );
}
