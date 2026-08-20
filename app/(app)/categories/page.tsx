"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useFinanceStore } from "@/lib/store";
import { useToastStore } from "@/lib/toast-store";
import type { Category, TransactionType } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconBadge } from "@/components/ui/icon-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmModal } from "@/components/ui/modal";
import { MaterialIcon } from "@/components/ui/material-icon";
import { CategoryFormModal } from "@/components/categories/category-form-modal";
import { cn } from "@/lib/cn";

export default function CategoriesPage() {
  const categories = useFinanceStore((s) => s.categories);
  const transactions = useFinanceStore((s) => s.transactions);
  const deleteCategory = useFinanceStore((s) => s.deleteCategory);
  const showToast = useToastStore((s) => s.show);

  const [filter, setFilter] = useState<"all" | TransactionType>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | undefined>(undefined);
  const [deleting, setDeleting] = useState<Category | undefined>(undefined);

  const filtered = useMemo(
    () => categories.filter((c) => filter === "all" || c.type === filter),
    [categories, filter]
  );

  function openCreate() {
    setEditing(undefined);
    setFormOpen(true);
  }

  function openEdit(category: Category) {
    setEditing(category);
    setFormOpen(true);
  }

  const usageCount = (categoryId: string) => transactions.filter((t) => t.categoryId === categoryId).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 rounded-[var(--radius-md)] border border-border bg-surface p-1">
          {(
            [
              { value: "all", label: "Todas" },
              { value: "expense", label: "Despesas" },
              { value: "income", label: "Receitas" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={cn(
                "rounded-[var(--radius-sm)] px-3 py-1.5 text-sm font-medium transition-colors",
                filter === tab.value
                  ? "bg-primary-soft text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <Button onClick={openCreate}>
          <MaterialIcon name="add" size={18} />
          Nova categoria
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="sell"
          title="Nenhuma categoria encontrada"
          description="Crie categorias para organizar melhor as suas transações."
          action={
            <Button size="sm" onClick={openCreate}>
              <MaterialIcon name="add" size={16} />
              Nova categoria
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((category) => (
            <Card key={category.id} className="group flex items-center gap-3 p-4 transition-colors hover:bg-surface-hover">
              <Link
                href={`/transactions?categoryId=${category.id}`}
                className="flex min-w-0 flex-1 items-center gap-3"
              >
                <IconBadge icon={category.icon} color={category.color} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{category.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {category.type === "income" ? "Receita" : "Despesa"} &middot; {usageCount(category.id)} transações
                  </p>
                </div>
              </Link>
              <div className="flex shrink-0 gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:bg-surface hover:text-foreground"
                  onClick={() => openEdit(category)}
                >
                  <MaterialIcon name="edit" size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:bg-danger-soft hover:text-danger"
                  onClick={() => setDeleting(category)}
                >
                  <MaterialIcon name="delete" size={16} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <CategoryFormModal open={formOpen} onClose={() => setFormOpen(false)} category={editing} />
      <ConfirmModal
        open={!!deleting}
        onClose={() => setDeleting(undefined)}
        title="Eliminar categoria"
        description={`Tem a certeza que pretende eliminar "${deleting?.name}"? As transações e orçamentos associados serão também eliminados.`}
        onConfirm={() => {
          if (deleting) {
            deleteCategory(deleting.id);
            showToast("Categoria eliminada.", "danger");
          }
        }}
      />
    </div>
  );
}
