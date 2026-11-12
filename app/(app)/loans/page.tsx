"use client";

import { useState } from "react";
import { useFinanceStore } from "@/lib/store";
import { useToastStore } from "@/lib/toast-store";
import { getLoanSummary } from "@/lib/calculations";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Loan } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmModal } from "@/components/ui/modal";
import { MaterialIcon } from "@/components/ui/material-icon";
import { LoanFormModal } from "@/components/loans/loan-form-modal";
import { LoanPaymentModal } from "@/components/loans/loan-payment-modal";

export default function LoansPage() {
  const loans = useFinanceStore((s) => s.loans);
  const accounts = useFinanceStore((s) => s.accounts);
  const deleteLoan = useFinanceStore((s) => s.deleteLoan);
  const showToast = useToastStore((s) => s.show);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Loan | undefined>(undefined);
  const [deleting, setDeleting] = useState<Loan | undefined>(undefined);
  const [paying, setPaying] = useState<Loan | undefined>(undefined);

  const summaries = loans
    .map((l) => getLoanSummary(l))
    .sort((a, b) => Number(a.isSettled) - Number(b.isSettled));

  const owed = summaries.filter((s) => s.loan.direction === "borrowed").reduce((n, s) => n + s.remaining, 0);
  const receivable = summaries.filter((s) => s.loan.direction === "lent").reduce((n, s) => n + s.remaining, 0);

  function openCreate() {
    setEditing(undefined);
    setFormOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Button onClick={openCreate}>
          <MaterialIcon name="add" size={18} />
          Novo empréstimo
        </Button>
      </div>

      {summaries.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card className="p-5">
            <p className="text-xs text-muted-foreground">Eu devo</p>
            <p className="font-tabular mt-1 text-xl font-semibold text-danger">{formatCurrency(owed)}</p>
          </Card>
          <Card className="p-5">
            <p className="text-xs text-muted-foreground">Devem-me</p>
            <p className="font-tabular mt-1 text-xl font-semibold text-success">{formatCurrency(receivable)}</p>
          </Card>
        </div>
      )}

      {summaries.length === 0 ? (
        <EmptyState
          icon="handshake"
          title="Sem empréstimos"
          description="Registe dinheiro que pediu emprestado ou que emprestou e acompanhe os pagamentos."
          action={
            <Button size="sm" onClick={openCreate}>
              <MaterialIcon name="add" size={16} />
              Novo empréstimo
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {summaries.map((s) => {
            const lent = s.loan.direction === "lent";
            const accountName = accounts.find((a) => a.id === s.loan.accountId)?.name;
            return (
              <Card key={s.loan.id} className="flex flex-col p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{s.loan.counterparty}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(s.loan.date)}
                      {accountName ? ` · ${accountName}` : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                      onClick={() => {
                        setEditing(s.loan);
                        setFormOpen(true);
                      }}
                      aria-label="Editar empréstimo"
                    >
                      <MaterialIcon name="edit" size={15} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:bg-danger-soft hover:text-danger"
                      onClick={() => setDeleting(s.loan)}
                      aria-label="Eliminar empréstimo"
                    >
                      <MaterialIcon name="delete" size={15} />
                    </Button>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  <Badge tone={lent ? "success" : "danger"}>{lent ? "Emprestei" : "Pedi emprestado"}</Badge>
                  {s.isSettled && <Badge tone="success">Liquidado</Badge>}
                  {s.isOverdue && <Badge tone="warning">Em atraso</Badge>}
                </div>

                <div className="mt-4 flex-1">
                  <div className="flex items-baseline justify-between">
                    <span className="font-tabular text-xl font-semibold text-foreground">
                      {formatCurrency(s.remaining)}
                    </span>
                    <span className="text-xs text-muted-foreground">de {formatCurrency(s.totalDue)}</span>
                  </div>
                  <div className="mt-2">
                    <ProgressBar value={s.percentage} color={lent ? "var(--success)" : "var(--danger)"} />
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                    <span>{lent ? "Recebido" : "Pago"} {formatCurrency(s.paid)}</span>
                    {s.loan.dueDate && <span>Vence {formatDate(s.loan.dueDate)}</span>}
                  </div>
                  {s.loan.interestRate > 0 && (
                    <p className="mt-1 text-xs text-muted-foreground">Juro: {s.loan.interestRate}%</p>
                  )}
                  {s.loan.description && <p className="mt-2 text-xs text-muted-foreground">{s.loan.description}</p>}
                </div>

                <Button variant="outline" size="sm" className="mt-4 w-full" onClick={() => setPaying(s.loan)}>
                  <MaterialIcon name={lent ? "download" : "payments"} size={16} />
                  {s.isSettled ? "Ver histórico" : lent ? "Registar recebimento" : "Registar pagamento"}
                </Button>
              </Card>
            );
          })}
        </div>
      )}

      <LoanFormModal open={formOpen} onClose={() => setFormOpen(false)} loan={editing} />
      <LoanPaymentModal open={!!paying} onClose={() => setPaying(undefined)} loan={paying} />
      <ConfirmModal
        open={!!deleting}
        onClose={() => setDeleting(undefined)}
        title="Eliminar empréstimo"
        description={`Eliminar o empréstimo de "${deleting?.counterparty}"? O movimento nas contas também será revertido.`}
        onConfirm={() => {
          if (deleting) {
            deleteLoan(deleting.id);
            showToast("Empréstimo eliminado.", "danger");
          }
        }}
      />
    </div>
  );
}
