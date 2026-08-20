"use client";

import { useState } from "react";
import type { RecurrenceFrequency, RecurringTransaction, TransactionType } from "@/lib/types";
import { useFinanceStore } from "@/lib/store";
import { useToastStore } from "@/lib/toast-store";
import { formatDateInput } from "@/lib/format";
import { Modal } from "@/components/ui/modal";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const FREQUENCY_OPTIONS: { value: RecurrenceFrequency; label: string }[] = [
  { value: "daily", label: "Diária" },
  { value: "weekly", label: "Semanal" },
  { value: "monthly", label: "Mensal" },
  { value: "yearly", label: "Anual" },
];

export function RecurringFormModal({
  open,
  onClose,
  recurring,
}: {
  open: boolean;
  onClose: () => void;
  recurring?: RecurringTransaction;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={recurring ? "Editar recorrência" : "Nova transação recorrente"}
      description="Movimentos automáticos gerados periodicamente."
    >
      {open && <RecurringForm recurring={recurring} onClose={onClose} />}
    </Modal>
  );
}

function RecurringForm({ recurring, onClose }: { recurring?: RecurringTransaction; onClose: () => void }) {
  const categories = useFinanceStore((s) => s.categories);
  const accounts = useFinanceStore((s) => s.accounts);
  const addRecurring = useFinanceStore((s) => s.addRecurring);
  const updateRecurring = useFinanceStore((s) => s.updateRecurring);
  const showToast = useToastStore((s) => s.show);

  const [type, setType] = useState<TransactionType>(recurring?.type ?? "expense");
  const [amount, setAmount] = useState(recurring ? String(recurring.amount) : "");
  const [categoryId, setCategoryId] = useState(
    recurring?.categoryId ?? categories.find((c) => c.type === (recurring?.type ?? "expense"))?.id ?? ""
  );
  const [accountId, setAccountId] = useState(recurring?.accountId ?? accounts[0]?.id ?? "");
  const [description, setDescription] = useState(recurring?.description ?? "");
  const [frequency, setFrequency] = useState<RecurrenceFrequency>(recurring?.frequency ?? "monthly");
  const [startDate, setStartDate] = useState(
    recurring ? formatDateInput(recurring.startDate) : formatDateInput(new Date())
  );
  const [endDate, setEndDate] = useState(recurring?.endDate ? formatDateInput(recurring.endDate) : "");
  const [active, setActive] = useState(recurring?.active ?? true);

  const filteredCategories = categories.filter((c) => c.type === type);

  function filteredCategoriesFor(t: TransactionType) {
    return categories.filter((c) => c.type === t);
  }

  function handleTypeChange(nextType: TransactionType) {
    setType(nextType);
    if (!filteredCategoriesFor(nextType).some((c) => c.id === categoryId)) {
      setCategoryId(filteredCategoriesFor(nextType)[0]?.id ?? "");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      type,
      amount: Number(amount) || 0,
      categoryId,
      accountId,
      description: description.trim() || undefined,
      frequency,
      startDate,
      endDate: endDate || undefined,
      active,
    };
    if (recurring) {
      updateRecurring(recurring.id, payload);
      showToast("Transação recorrente atualizada.");
    } else {
      addRecurring(payload);
      showToast("Transação recorrente criada.");
    }
    onClose();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => handleTypeChange("expense")}
          className={cn(
            "h-10 rounded-[var(--radius-sm)] border text-sm font-medium transition-colors",
            type === "expense"
              ? "border-danger/40 bg-danger-soft text-danger"
              : "border-border text-muted-foreground hover:bg-surface-hover"
          )}
        >
          Despesa
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange("income")}
          className={cn(
            "h-10 rounded-[var(--radius-sm)] border text-sm font-medium transition-colors",
            type === "income"
              ? "border-success/40 bg-success-soft text-success"
              : "border-border text-muted-foreground hover:bg-surface-hover"
          )}
        >
          Receita
        </button>
      </div>

      <div>
        <Label htmlFor="rec-amount">Valor (MT)</Label>
        <Input
          id="rec-amount"
          type="number"
          step="0.01"
          min="0"
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="rec-category">Categoria</Label>
          <Select id="rec-category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
            {filteredCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="rec-account">Conta</Label>
          <Select id="rec-account" value={accountId} onChange={(e) => setAccountId(e.target.value)} required>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="rec-frequency">Frequência</Label>
        <Select id="rec-frequency" value={frequency} onChange={(e) => setFrequency(e.target.value as RecurrenceFrequency)}>
          {FREQUENCY_OPTIONS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="rec-start">Início</Label>
          <Input id="rec-start" type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="rec-end">Fim (opcional)</Label>
          <Input id="rec-end" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
      </div>

      <div>
        <Label htmlFor="rec-description">Descrição (opcional)</Label>
        <Textarea
          id="rec-description"
          rows={2}
          placeholder="Ex: Salário mensal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
          className="h-4 w-4 rounded accent-[var(--accent)]"
        />
        Recorrência ativa
      </label>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit">{recurring ? "Guardar alterações" : "Criar recorrência"}</Button>
      </div>
    </form>
  );
}
