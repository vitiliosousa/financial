"use client";

import { useState } from "react";
import type { Category, IconName, TransactionType } from "@/lib/types";
import { useFinanceStore } from "@/lib/store";
import { useToastStore } from "@/lib/toast-store";
import { Modal } from "@/components/ui/modal";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconPicker } from "@/components/ui/icon-picker";
import { ColorPicker } from "@/components/ui/color-picker";
import { cn } from "@/lib/cn";

export function CategoryFormModal({
  open,
  onClose,
  category,
  defaultType = "expense",
}: {
  open: boolean;
  onClose: () => void;
  category?: Category;
  defaultType?: TransactionType;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={category ? "Editar categoria" : "Nova categoria"}
      description="Organize as suas transações por categoria."
    >
      {open && <CategoryForm category={category} defaultType={defaultType} onClose={onClose} />}
    </Modal>
  );
}

function CategoryForm({
  category,
  defaultType,
  onClose,
}: {
  category?: Category;
  defaultType: TransactionType;
  onClose: () => void;
}) {
  const addCategory = useFinanceStore((s) => s.addCategory);
  const updateCategory = useFinanceStore((s) => s.updateCategory);
  const showToast = useToastStore((s) => s.show);

  const [name, setName] = useState(category?.name ?? "");
  const [type, setType] = useState<TransactionType>(category?.type ?? defaultType);
  const [icon, setIcon] = useState<IconName>(category?.icon ?? "coins");
  const [color, setColor] = useState(category?.color ?? "#d9a72c");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { name: name.trim(), type, icon, color };
    if (category) {
      updateCategory(category.id, payload);
      showToast("Categoria atualizada com sucesso.");
    } else {
      addCategory(payload);
      showToast("Categoria criada com sucesso.");
    }
    onClose();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="category-name">Nome</Label>
        <Input
          id="category-name"
          required
          placeholder="Ex: Alimentação, Salário..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <Label>Tipo</Label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setType("expense")}
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
            onClick={() => setType("income")}
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
        <Button type="submit">{category ? "Guardar alterações" : "Criar categoria"}</Button>
      </div>
    </form>
  );
}
