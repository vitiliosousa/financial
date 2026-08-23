"use client";

import { useState } from "react";
import { useFinanceStore } from "@/lib/store";
import { useToastStore } from "@/lib/toast-store";
import { getAccountBalance } from "@/lib/calculations";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Account } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmModal } from "@/components/ui/modal";
import { MaterialIcon } from "@/components/ui/material-icon";
import { AccountFormModal } from "@/components/accounts/account-form-modal";
import { AccountCard } from "@/components/accounts/account-card";
import { TransferFormModal } from "@/components/accounts/transfer-form-modal";

export default function AccountsPage() {
  const accounts = useFinanceStore((s) => s.accounts);
  const transactions = useFinanceStore((s) => s.transactions);
  const transfers = useFinanceStore((s) => s.transfers);
  const deleteAccount = useFinanceStore((s) => s.deleteAccount);
  const deleteTransfer = useFinanceStore((s) => s.deleteTransfer);
  const showToast = useToastStore((s) => s.show);

  const [formOpen, setFormOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [editing, setEditing] = useState<Account | undefined>(undefined);
  const [deleting, setDeleting] = useState<Account | undefined>(undefined);
  const [showAllTransfers, setShowAllTransfers] = useState(false);

  const TRANSFERS_PREVIEW = 5;
  const visibleTransfers = showAllTransfers ? transfers : transfers.slice(0, TRANSFERS_PREVIEW);

  const totalBalance = accounts.reduce((sum, a) => sum + getAccountBalance(a, transactions, transfers), 0);
  const accountName = (id: string) => accounts.find((a) => a.id === id)?.name ?? "Conta eliminada";

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
        <div className="flex gap-2 self-end sm:self-auto">
          {accounts.length >= 2 && (
            <Button variant="outline" onClick={() => setTransferOpen(true)}>
              <MaterialIcon name="sync_alt" size={18} />
              Transferir
            </Button>
          )}
          <Button onClick={openCreate}>
            <MaterialIcon name="add" size={18} />
            Nova conta
          </Button>
        </div>
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
              balance={getAccountBalance(account, transactions, transfers)}
              onEdit={() => openEdit(account)}
              onDelete={() => setDeleting(account)}
            />
          ))}
        </div>
      )}

      {transfers.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold text-foreground">Transferências recentes</h2>
          <div className="divide-y divide-border rounded-[var(--radius-lg)] border border-border">
            {visibleTransfers.map((transfer) => (
              <div key={transfer.id} className="flex items-center gap-3 px-4 py-3 text-sm">
                <MaterialIcon name="sync_alt" size={18} className="shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-foreground">
                    {accountName(transfer.fromId)} → {accountName(transfer.toId)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {transfer.description ? `${transfer.description} · ` : ""}
                    {transfer.fee > 0 ? `taxa ${formatCurrency(transfer.fee)} · ` : ""}
                    {formatDate(transfer.date)}
                  </p>
                </div>
                <p className="shrink-0 font-medium text-foreground">{formatCurrency(transfer.amount)}</p>
                <button
                  type="button"
                  onClick={() => {
                    deleteTransfer(transfer.id);
                    showToast("Transferência eliminada.", "danger");
                  }}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] text-muted-foreground transition-colors hover:bg-danger-soft hover:text-danger"
                  aria-label="Eliminar transferência"
                >
                  <MaterialIcon name="delete" size={16} />
                </button>
              </div>
            ))}
          </div>
          {transfers.length > TRANSFERS_PREVIEW && (
            <button
              type="button"
              onClick={() => setShowAllTransfers((v) => !v)}
              className="mt-2 text-xs font-medium text-accent hover:underline"
            >
              {showAllTransfers ? "Mostrar menos" : `Ver todas (${transfers.length})`}
            </button>
          )}
        </div>
      )}

      <AccountFormModal open={formOpen} onClose={() => setFormOpen(false)} account={editing} />
      <TransferFormModal open={transferOpen} onClose={() => setTransferOpen(false)} />
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
