"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useFinanceStore } from "@/lib/store";
import { useToastStore } from "@/lib/toast-store";
import { formatCurrency, formatDate } from "@/lib/format";
import { parseLocalDate } from "@/lib/date";
import type { Transaction, TransactionType } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { IconBadge } from "@/components/ui/icon-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmModal } from "@/components/ui/modal";
import { MaterialIcon } from "@/components/ui/material-icon";
import { TransactionFormModal } from "@/components/transactions/transaction-form-modal";
import { TransactionsTabs } from "@/components/transactions/transactions-tabs";
import { cn } from "@/lib/cn";

type Period = "all" | "this-month" | "last-month" | "last-3" | "last-6" | "this-year" | "custom";
type SortOption = "date-desc" | "date-asc" | "amount-desc" | "amount-asc";

function getPeriodRange(period: Period, custom: { start: string; end: string }): [Date, Date] | null {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
  switch (period) {
    case "this-month":
      return [new Date(now.getFullYear(), now.getMonth(), 1), today];
    case "last-month":
      return [
        new Date(now.getFullYear(), now.getMonth() - 1, 1),
        new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59),
      ];
    case "last-3":
      return [new Date(now.getFullYear(), now.getMonth() - 2, 1), today];
    case "last-6":
      return [new Date(now.getFullYear(), now.getMonth() - 5, 1), today];
    case "this-year":
      return [new Date(now.getFullYear(), 0, 1), today];
    case "custom": {
      if (!custom.start || !custom.end) return null;
      const end = parseLocalDate(custom.end);
      end.setHours(23, 59, 59);
      return [parseLocalDate(custom.start), end];
    }
    default:
      return null;
  }
}

export default function TransactionsPage() {
  return (
    <Suspense fallback={null}>
      <TransactionsPageContent />
    </Suspense>
  );
}

function TransactionsPageContent() {
  const searchParams = useSearchParams();
  const initialAccountId = searchParams.get("accountId") ?? "all";
  const initialCategoryId = searchParams.get("categoryId") ?? "all";
  const hasDeepLinkFilter = initialAccountId !== "all" || initialCategoryId !== "all";

  const { transactions, categories, accounts, deleteTransaction } = useFinanceStore((s) => s);
  const showToast = useToastStore((s) => s.show);

  const [search, setSearch] = useState("");
  const [type, setType] = useState<"all" | TransactionType>("all");
  const [categoryId, setCategoryId] = useState(initialCategoryId);
  const [accountId, setAccountId] = useState(initialAccountId);
  const [period, setPeriod] = useState<Period>(hasDeepLinkFilter ? "all" : "this-month");
  const [customRange, setCustomRange] = useState({ start: "", end: "" });
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | undefined>(undefined);
  const [deleting, setDeleting] = useState<Transaction | undefined>(undefined);

  const filtered = useMemo(() => {
    const range = period === "all" ? null : getPeriodRange(period, customRange);
    let result = transactions.filter((t) => {
      if (type !== "all" && t.type !== type) return false;
      if (categoryId !== "all" && t.categoryId !== categoryId) return false;
      if (accountId !== "all" && t.accountId !== accountId) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const category = categories.find((c) => c.id === t.categoryId);
        const matches =
          (t.description ?? "").toLowerCase().includes(q) || (category?.name ?? "").toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (range) {
        const [start, end] = range;
        const d = parseLocalDate(t.date);
        if (d < start || d > end) return false;
      }
      return true;
    });

    result = result.sort((a, b) => {
      switch (sortBy) {
        case "date-asc":
          return parseLocalDate(a.date).getTime() - parseLocalDate(b.date).getTime();
        case "amount-desc":
          return b.amount - a.amount;
        case "amount-asc":
          return a.amount - b.amount;
        default:
          return parseLocalDate(b.date).getTime() - parseLocalDate(a.date).getTime();
      }
    });

    return result;
  }, [transactions, categories, type, categoryId, accountId, search, period, customRange, sortBy]);

  const totalIncome = filtered.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = filtered.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);

  const filterAccount = accountId !== "all" ? accounts.find((a) => a.id === accountId) : undefined;
  const filterCategory = categoryId !== "all" ? categories.find((c) => c.id === categoryId) : undefined;

  function openCreate() {
    setEditing(undefined);
    setFormOpen(true);
  }
  function openEdit(t: Transaction) {
    setEditing(t);
    setFormOpen(true);
  }

  return (
    <div className="space-y-6">
      <TransactionsTabs />

      {(filterAccount || filterCategory) && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground">A filtrar por:</span>
          {filterAccount && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-hover px-3 py-1 text-xs font-medium text-foreground">
              {filterAccount.name}
              <button onClick={() => setAccountId("all")} aria-label="Remover filtro de conta">
                <MaterialIcon name="close" size={14} className="text-muted-foreground" />
              </button>
            </span>
          )}
          {filterCategory && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-hover px-3 py-1 text-xs font-medium text-foreground">
              {filterCategory.name}
              <button onClick={() => setCategoryId("all")} aria-label="Remover filtro de categoria">
                <MaterialIcon name="close" size={14} className="text-muted-foreground" />
              </button>
            </span>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:w-fit sm:grid-cols-2">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Receitas (filtro atual)</p>
          <p className="mt-1 text-lg font-medium text-success">{formatCurrency(totalIncome)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Despesas (filtro atual)</p>
          <p className="mt-1 text-lg font-medium text-danger">{formatCurrency(totalExpense)}</p>
        </Card>
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-xs">
            <MaterialIcon
              name="search"
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Pesquisar por descrição..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Select className="w-auto" value={type} onChange={(e) => setType(e.target.value as typeof type)}>
              <option value="all">Todos os tipos</option>
              <option value="income">Receitas</option>
              <option value="expense">Despesas</option>
            </Select>
            <Select className="w-auto" value={accountId} onChange={(e) => setAccountId(e.target.value)}>
              <option value="all">Todas as contas</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </Select>
            <Select className="w-auto" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              <option value="all">Todas as categorias</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
            <Select className="w-auto" value={period} onChange={(e) => setPeriod(e.target.value as Period)}>
              <option value="all">Todo o período</option>
              <option value="this-month">Este mês</option>
              <option value="last-month">Mês passado</option>
              <option value="last-3">Últimos 3 meses</option>
              <option value="last-6">Últimos 6 meses</option>
              <option value="this-year">Este ano</option>
              <option value="custom">Personalizado</option>
            </Select>
            <Select className="w-auto" value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)}>
              <option value="date-desc">Data (recente)</option>
              <option value="date-asc">Data (antiga)</option>
              <option value="amount-desc">Valor (maior)</option>
              <option value="amount-asc">Valor (menor)</option>
            </Select>
          </div>
        </div>

        {period === "custom" && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Input
              type="date"
              className="w-auto"
              value={customRange.start}
              onChange={(e) => setCustomRange((r) => ({ ...r, start: e.target.value }))}
            />
            <span className="text-sm text-muted-foreground">até</span>
            <Input
              type="date"
              className="w-auto"
              value={customRange.end}
              onChange={(e) => setCustomRange((r) => ({ ...r, end: e.target.value }))}
            />
          </div>
        )}
      </Card>

      <Card>
        <div className="flex items-center justify-between p-5 pb-0">
          <div>
            <p className="text-sm font-medium text-foreground">{filtered.length} transações</p>
          </div>
          <Button size="sm" onClick={openCreate}>
            <MaterialIcon name="add" size={16} />
            Nova transação
          </Button>
        </div>
        <div className="p-5">
          {filtered.length === 0 ? (
            <EmptyState
              icon="sync_alt"
              title="Nenhuma transação encontrada"
              description="Experimente ajustar os filtros ou crie uma nova transação."
            />
          ) : (
            <div className="divide-y divide-border">
              {filtered.map((t) => {
                const category = categories.find((c) => c.id === t.categoryId);
                const account = accounts.find((a) => a.id === t.accountId);
                const isIncome = t.type === "income";
                return (
                  <div key={t.id} className="group flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <IconBadge icon={category?.icon ?? "coins"} color={category?.color ?? "#6b7280"} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {t.description || category?.name || "Transação"}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {category?.name} &middot; {account?.name} &middot; {formatDate(t.date)}
                      </p>
                    </div>
                    <p className={cn("shrink-0 text-sm font-medium", isIncome ? "text-success" : "text-danger")}>
                      {isIncome ? "+" : "-"}
                      {formatCurrency(t.amount)}
                    </p>
                    <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                        onClick={() => openEdit(t)}
                      >
                        <MaterialIcon name="edit" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:bg-danger-soft hover:text-danger"
                        onClick={() => setDeleting(t)}
                      >
                        <MaterialIcon name="delete" size={16} />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>

      <TransactionFormModal open={formOpen} onClose={() => setFormOpen(false)} transaction={editing} />
      <ConfirmModal
        open={!!deleting}
        onClose={() => setDeleting(undefined)}
        title="Eliminar transação"
        description="Tem a certeza que pretende eliminar esta transação? Esta ação não pode ser desfeita."
        onConfirm={() => {
          if (deleting) {
            deleteTransaction(deleting.id);
            showToast("Transação eliminada.", "danger");
          }
        }}
      />
    </div>
  );
}
