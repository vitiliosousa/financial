"use client";

import { useState } from "react";
import type { Loan } from "@/lib/types";
import { useFinanceStore } from "@/lib/store";
import { useToastStore } from "@/lib/toast-store";
import { getLoanSummary } from "@/lib/calculations";
import { formatCurrency, formatDate, formatDateInput } from "@/lib/format";
import { Modal } from "@/components/ui/modal";
import { Input, Label, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MaterialIcon } from "@/components/ui/material-icon";

export function LoanPaymentModal({
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
      title={loan?.direction === "lent" ? "Registar recebimento" : "Registar pagamento"}
      description={loan?.counterparty}
    >
      {open && loan && <PaymentForm loan={loan} onClose={onClose} />}
    </Modal>
  );
}

function PaymentForm({ loan, onClose }: { loan: Loan; onClose: () => void }) {
  const accounts = useFinanceStore((s) => s.accounts);
  // Read the live loan so a just-added payment shows up in the history immediately.
  const live = useFinanceStore((s) => s.loans.find((l) => l.id === loan.id)) ?? loan;
  const addLoanPayment = useFinanceStore((s) => s.addLoanPayment);
  const deleteLoanPayment = useFinanceStore((s) => s.deleteLoanPayment);
  const showToast = useToastStore((s) => s.show);

  const summary = getLoanSummary(live);
  const [amount, setAmount] = useState(summary.remaining > 0 ? String(Number(summary.remaining.toFixed(2))) : "");
  const [accountId, setAccountId] = useState(live.accountId);
  const [date, setDate] = useState(formatDateInput(new Date()));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = Number(amount) || 0;
    if (value <= 0) return;
    addLoanPayment(live.id, { accountId, amount: value, date });
    showToast(live.direction === "lent" ? "Recebimento registado." : "Pagamento registado.");
    setAmount("");
  }

  const payments = [...live.payments].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-[var(--radius-sm)] bg-surface-hover p-3 text-sm">
        <span className="text-muted-foreground">Em falta</span>
        <span className="font-tabular font-semibold text-foreground">{formatCurrency(summary.remaining)}</span>
      </div>

      {!summary.isSettled && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="loanpay-amount">Valor (MT)</Label>
              <Input
                id="loanpay-amount"
                type="number"
                step="0.01"
                min="0"
                required
                autoFocus
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="loanpay-date">Data</Label>
              <Input id="loanpay-date" type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </div>
          <div>
            <Label htmlFor="loanpay-account">Conta</Label>
            <Select id="loanpay-account" value={accountId} onChange={(e) => setAccountId(e.target.value)}>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Fechar
            </Button>
            <Button type="submit">{live.direction === "lent" ? "Registar recebimento" : "Registar pagamento"}</Button>
          </div>
        </form>
      )}

      {payments.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">Histórico</p>
          <ul className="divide-y divide-border">
            {payments.map((p) => (
              <li key={p.id} className="flex items-center justify-between py-2 text-sm">
                <span className="text-muted-foreground">{formatDate(p.date)}</span>
                <span className="flex items-center gap-2">
                  <span className="font-tabular font-medium text-foreground">{formatCurrency(p.amount)}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:bg-danger-soft hover:text-danger"
                    onClick={() => deleteLoanPayment(live.id, p.id)}
                    aria-label="Eliminar pagamento"
                  >
                    <MaterialIcon name="delete" size={15} />
                  </Button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {summary.isSettled && (
        <div className="flex justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      )}
    </div>
  );
}
