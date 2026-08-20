"use client";

import { useState } from "react";
import type { Goal, IconName } from "@/lib/types";
import { useFinanceStore } from "@/lib/store";
import { useToastStore } from "@/lib/toast-store";
import { Modal } from "@/components/ui/modal";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconPicker } from "@/components/ui/icon-picker";
import { ColorPicker } from "@/components/ui/color-picker";

export function GoalFormModal({
  open,
  onClose,
  goal,
}: {
  open: boolean;
  onClose: () => void;
  goal?: Goal;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={goal ? "Editar meta" : "Nova meta financeira"}
      description="Defina um objetivo de poupança para acompanhar o seu progresso."
    >
      {open && <GoalForm goal={goal} onClose={onClose} />}
    </Modal>
  );
}

function GoalForm({ goal, onClose }: { goal?: Goal; onClose: () => void }) {
  const addGoal = useFinanceStore((s) => s.addGoal);
  const updateGoal = useFinanceStore((s) => s.updateGoal);
  const showToast = useToastStore((s) => s.show);

  const [name, setName] = useState(goal?.name ?? "");
  const [targetAmount, setTargetAmount] = useState(goal ? String(goal.targetAmount) : "");
  const [currentAmount, setCurrentAmount] = useState(goal ? String(goal.currentAmount) : "0");
  const [deadline, setDeadline] = useState(goal?.deadline?.slice(0, 10) ?? "");
  const [icon, setIcon] = useState<IconName>(goal?.icon ?? "target");
  const [color, setColor] = useState(goal?.color ?? "#6d5ef8");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      name: name.trim(),
      targetAmount: Number(targetAmount) || 0,
      currentAmount: Number(currentAmount) || 0,
      deadline: deadline || undefined,
      icon,
      color,
    };
    if (goal) {
      updateGoal(goal.id, payload);
      showToast("Meta atualizada com sucesso.");
    } else {
      addGoal(payload);
      showToast("Meta criada com sucesso.");
    }
    onClose();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="goal-name">Nome</Label>
        <Input
          id="goal-name"
          required
          placeholder="Ex: Fundo de emergência"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="goal-target">Valor objetivo (MT)</Label>
          <Input
            id="goal-target"
            type="number"
            step="0.01"
            min="0"
            required
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="goal-current">Valor atual (MT)</Label>
          <Input
            id="goal-current"
            type="number"
            step="0.01"
            min="0"
            value={currentAmount}
            onChange={(e) => setCurrentAmount(e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="goal-deadline">Prazo (opcional)</Label>
        <Input id="goal-deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
      </div>

      <div>
        <Label>Cor</Label>
        <ColorPicker value={color} onChange={setColor} />
      </div>

      <div>
        <Label>Ícone</Label>
        <IconPicker value={icon} onChange={setIcon} color={color} />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit">{goal ? "Guardar alterações" : "Criar meta"}</Button>
      </div>
    </form>
  );
}
