"use client";

import { useState } from "react";
import type { Budget } from "@/lib/types";
import { useFinanceStore } from "@/lib/store";
import { useToastStore } from "@/lib/toast-store";
import { Modal } from "@/components/ui/modal";
import { Input, Label, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function BudgetFormModal({
  open,
  onClose,
  budget,
}: {
  open: boolean;
  onClose: () => void;
  budget?: Budget;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={budget ? "Editar orçamento" : "Novo orçamento"}
      description="Defina um limite mensal de despesa para uma categoria."
    >
      {open && <BudgetForm budget={budget} onClose={onClose} />}
    </Modal>
  );
}

function BudgetForm({ budget, onClose }: { budget?: Budget; onClose: () => void }) {
  const categories = useFinanceStore((s) => s.categories);
  const budgets = useFinanceStore((s) => s.budgets);
  const addBudget = useFinanceStore((s) => s.addBudget);
  const updateBudget = useFinanceStore((s) => s.updateBudget);
  const showToast = useToastStore((s) => s.show);

  const now = new Date();
  const expenseCategories = categories.filter((c) => c.type === "expense");

  const [categoryId, setCategoryId] = useState(budget?.categoryId ?? expenseCategories[0]?.id ?? "");
  const [limit, setLimit] = useState(budget ? String(budget.limit) : "");

  const alreadyBudgeted = budgets.some(
    (b) => b.categoryId === categoryId && b.month === now.getMonth() && b.year === now.getFullYear() && b.id !== budget?.id
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      categoryId,
      limit: Number(limit) || 0,
      month: now.getMonth(),
      year: now.getFullYear(),
    };
    if (budget) {
      updateBudget(budget.id, payload);
      showToast("Orçamento atualizado com sucesso.");
    } else {
      addBudget(payload);
      showToast("Orçamento criado com sucesso.");
    }
    onClose();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="budget-category">Categoria</Label>
        <Select
          id="budget-category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
          disabled={!!budget}
        >
          {expenseCategories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
        {alreadyBudgeted && (
          <p className="mt-1.5 text-xs text-warning">Já existe um orçamento para esta categoria este mês.</p>
        )}
      </div>

      <div>
        <Label htmlFor="budget-limit">Limite mensal (MT)</Label>
        <Input
          id="budget-limit"
          type="number"
          step="0.01"
          min="0"
          required
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={alreadyBudgeted}>
          {budget ? "Guardar alterações" : "Criar orçamento"}
        </Button>
      </div>
    </form>
  );
}
