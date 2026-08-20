"use client";

import { useState } from "react";
import { useFinanceStore } from "@/lib/store";
import { useToastStore } from "@/lib/toast-store";
import { getAccountBalance } from "@/lib/calculations";
import { formatCurrency } from "@/lib/format";
import type { Account } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmModal } from "@/components/ui/modal";
import { MaterialIcon } from "@/components/ui/material-icon";
import { AccountFormModal } from "@/components/accounts/account-form-modal";
import { AccountCard } from "@/components/accounts/account-card";

export default function AccountsPage() {
  const accounts = useFinanceStore((s) => s.accounts);
  const transactions = useFinanceStore((s) => s.transactions);
  const deleteAccount = useFinanceStore((s) => s.deleteAccount);
  const showToast = useToastStore((s) => s.show);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Account | undefined>(undefined);
  const [deleting, setDeleting] = useState<Account | undefined>(undefined);

  const totalBalance = accounts.reduce((sum, a) => sum + getAccountBalance(a, transactions), 0);

  function openCreate() {
    setEditing(undefined);
    setFormOpen(true);
  }

  function openEdit(account: Account) {
    setEditing(account);
    setFormOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Saldo total combinado: <span className="font-semibold text-foreground">{formatCurrency(totalBalance)}</span>
          </p>
        </div>
        <Button onClick={openCreate}>
          <MaterialIcon name="add" size={18} />
          Nova conta
        </Button>
      </div>

      {accounts.length === 0 ? (
        <EmptyState
          icon="account_balance_wallet"
          title="Ainda não tem contas"
          description="Crie a sua primeira conta para começar a acompanhar as suas finanças."
          action={
            <Button size="sm" onClick={openCreate}>
              <MaterialIcon name="add" size={16} />
              Nova conta
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {accounts.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              balance={getAccountBalance(account, transactions)}
              onEdit={() => openEdit(account)}
              onDelete={() => setDeleting(account)}
            />
          ))}
        </div>
      )}

      <AccountFormModal open={formOpen} onClose={() => setFormOpen(false)} account={editing} />
      <ConfirmModal
        open={!!deleting}
        onClose={() => setDeleting(undefined)}
        title="Eliminar conta"
        description={`Tem a certeza que pretende eliminar "${deleting?.name}"? Todas as transações associadas serão também eliminadas.`}
        onConfirm={() => {
          if (deleting) {
            deleteAccount(deleting.id);
            showToast("Conta eliminada.", "danger");
          }
        }}
      />
    </div>
  );
}
