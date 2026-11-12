"use client";

import { useState } from "react";
import type { Loan, LoanDirection } from "@/lib/types";
import { useFinanceStore } from "@/lib/store";
import { useToastStore } from "@/lib/toast-store";
import { formatDateInput } from "@/lib/format";
import { cn } from "@/lib/cn";
import { Modal } from "@/components/ui/modal";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LoanFormModal({
  open,
  onClose,
  loan,
}: {
  open: boolean;
  onClose: () => void;
  loan?: Loan;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={loan ? "Editar empréstimo" : "Novo empréstimo"}
      description="Registe dinheiro que pediu emprestado ou que emprestou a alguém."
    >
      {open && <LoanForm loan={loan} onClose={onClose} />}
    </Modal>
  );
}

const DIRECTIONS: { value: LoanDirection; label: string; hint: string }[] = [
  { value: "borrowed", label: "Pedi emprestado", hint: "O dinheiro entra na conta" },
  { value: "lent", label: "Emprestei", hint: "O dinheiro sai da conta" },
];

function LoanForm({ loan, onClose }: { loan?: Loan; onClose: () => void }) {
  const accounts = useFinanceStore((s) => s.accounts);
  const addLoan = useFinanceStore((s) => s.addLoan);
  const updateLoan = useFinanceStore((s) => s.updateLoan);
  const showToast = useToastStore((s) => s.show);

  const [direction, setDirection] = useState<LoanDirection>(loan?.direction ?? "borrowed");
  const [counterparty, setCounterparty] = useState(loan?.counterparty ?? "");
  const [principal, setPrincipal] = useState(loan ? String(loan.principal) : "");
  const [interestRate, setInterestRate] = useState(loan ? String(loan.interestRate) : "");
  const [accountId, setAccountId] = useState(loan?.accountId ?? accounts[0]?.id ?? "");
  const [date, setDate] = useState(loan?.date ?? formatDateInput(new Date()));
  const [dueDate, setDueDate] = useState(loan?.dueDate ?? "");
  const [description, setDescription] = useState(loan?.description ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      direction,
      counterparty: counterparty.trim(),
      principal: Number(principal) || 0,
      interestRate: Number(interestRate) || 0,
      accountId,
      date,
      dueDate: dueDate || undefined,
      description: description.trim() || undefined,
    };
    if (loan) {
      updateLoan(loan.id, payload);
      showToast("Empréstimo atualizado com sucesso.");
    } else {
      addLoan(payload);
      showToast("Empréstimo registado com sucesso.");
    }
    onClose();
  }

  if (accounts.length === 0) {
    return <p className="text-sm text-muted-foreground">Crie primeiro uma conta para registar empréstimos.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Tipo de empréstimo">
        {DIRECTIONS.map((d) => (
          <button
            key={d.value}
            type="button"
            role="radio"
            aria-checked={direction === d.value}
            onClick={() => setDirection(d.value)}
            className={cn(
              "rounded-[var(--radius-sm)] border px-3 py-2.5 text-left transition-colors",
              direction === d.value
                ? "border-primary bg-primary-soft text-primary"
                : "border-border text-foreground hover:bg-surface-hover"
            )}
          >
            <span className="block text-sm font-medium">{d.label}</span>
            <span className="block text-xs text-muted-foreground">{d.hint}</span>
          </button>
        ))}
      </div>

      <div>
        <Label htmlFor="loan-counterparty">{direction === "borrowed" ? "A quem pediu" : "A quem emprestou"}</Label>
        <Input
          id="loan-counterparty"
          required
          placeholder="Ex: João, Banco BCI"
          value={counterparty}
          onChange={(e) => setCounterparty(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="loan-principal">Valor (MT)</Label>
          <Input
            id="loan-principal"
            type="number"
            step="0.01"
            min="0"
            required
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="loan-interest">Juro total % (opcional)</Label>
          <Input
            id="loan-interest"
            type="number"
            step="0.01"
            min="0"
            placeholder="0"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="loan-account">Conta</Label>
        <Select id="loan-account" value={accountId} onChange={(e) => setAccountId(e.target.value)} required>
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="loan-date">Data</Label>
          <Input id="loan-date" type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="loan-due">Vencimento (opcional)</Label>
          <Input id="loan-due" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>
      </div>

      <div>
        <Label htmlFor="loan-description">Notas (opcional)</Label>
        <Textarea
          id="loan-description"
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit">{loan ? "Guardar alterações" : "Registar empréstimo"}</Button>
      </div>
    </form>
  );
}
