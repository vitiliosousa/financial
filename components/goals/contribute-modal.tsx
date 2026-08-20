"use client";

import { useState } from "react";
import type { Goal } from "@/lib/types";
import { useFinanceStore } from "@/lib/store";
import { useToastStore } from "@/lib/toast-store";
import { Modal } from "@/components/ui/modal";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ContributeModal({
  open,
  onClose,
  goal,
}: {
  open: boolean;
  onClose: () => void;
  goal?: Goal;
}) {
  const contributeToGoal = useFinanceStore((s) => s.contributeToGoal);
  const showToast = useToastStore((s) => s.show);
  const [amount, setAmount] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!goal) return;
    contributeToGoal(goal.id, Number(amount) || 0);
    showToast(`Adicionado à meta "${goal.name}".`);
    setAmount("");
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Adicionar fundos" description={goal?.name}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="contribute-amount">Valor a adicionar (MT)</Label>
          <Input
            id="contribute-amount"
            type="number"
            step="0.01"
            min="0"
            required
            autoFocus
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">Adicionar</Button>
        </div>
      </form>
    </Modal>
  );
}
