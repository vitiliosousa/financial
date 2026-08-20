"use client";

import { useState } from "react";
import type { Transaction, TransactionType } from "@/lib/types";
import { useFinanceStore } from "@/lib/store";
import { useToastStore } from "@/lib/toast-store";
import { formatDateInput } from "@/lib/format";
import { Modal } from "@/components/ui/modal";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export function TransactionFormModal({
  open,
  onClose,
  transaction,
}: {
  open: boolean;
  onClose: () => void;
  transaction?: Transaction;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={transaction ? "Editar transação" : "Nova transação"}
      description="Registe um movimento de receita ou despesa."
    >
      {open && <TransactionForm transaction={transaction} onClose={onClose} />}
    </Modal>
  );
}

function TransactionForm({ transaction, onClose }: { transaction?: Transaction; onClose: () => void }) {
  const categories = useFinanceStore((s) => s.categories);
  const accounts = useFinanceStore((s) => s.accounts);
  const addTransaction = useFinanceStore((s) => s.addTransaction);
  const updateTransaction = useFinanceStore((s) => s.updateTransaction);
  const showToast = useToastStore((s) => s.show);

  const [type, setType] = useState<TransactionType>(transaction?.type ?? "expense");
  const [amount, setAmount] = useState(transaction ? String(transaction.amount) : "");
  const [categoryId, setCategoryId] = useState(
    transaction?.categoryId ?? categories.find((c) => c.type === (transaction?.type ?? "expense"))?.id ?? ""
  );
  const [accountId, setAccountId] = useState(transaction?.accountId ?? accounts[0]?.id ?? "");
  const [date, setDate] = useState(transaction ? formatDateInput(transaction.date) : formatDateInput(new Date()));
  const [description, setDescription] = useState(transaction?.description ?? "");

  const filteredCategories = categories.filter((c) => c.type === type);

  function handleTypeChange(nextType: TransactionType) {
    setType(nextType);
    if (!filteredCategoriesFor(nextType).some((c) => c.id === categoryId)) {
      setCategoryId(filteredCategoriesFor(nextType)[0]?.id ?? "");
    }
  }

  function filteredCategoriesFor(t: TransactionType) {
    return categories.filter((c) => c.type === t);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      type,
      amount: Number(amount) || 0,
      categoryId,
      accountId,
      date,
      description: description.trim() || undefined,
    };
    if (transaction) {
      updateTransaction(transaction.id, payload);
      showToast("Transação atualizada com sucesso.");
    } else {
      addTransaction(payload);
      showToast("Transação criada com sucesso.");
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
        <Label htmlFor="tx-amount">Valor (MT)</Label>
        <Input
          id="tx-amount"
          type="number"
          step="0.01"
          min="0"
          required
          placeholder="0,00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="tx-category">Categoria</Label>
          <Select id="tx-category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
            {filteredCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="tx-account">Conta</Label>
          <Select id="tx-account" value={accountId} onChange={(e) => setAccountId(e.target.value)} required>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="tx-date">Data</Label>
        <Input id="tx-date" type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      <div>
        <Label htmlFor="tx-description">Descrição (opcional)</Label>
        <Textarea
          id="tx-description"
          rows={2}
          placeholder="Ex: Compras no supermercado"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit">{transaction ? "Guardar alterações" : "Criar transação"}</Button>
      </div>
    </form>
  );
}
