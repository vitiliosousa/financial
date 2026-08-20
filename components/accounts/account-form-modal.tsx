"use client";

import { useState } from "react";
import type { Account, IconName } from "@/lib/types";
import { useFinanceStore } from "@/lib/store";
import { useToastStore } from "@/lib/toast-store";
import { Modal } from "@/components/ui/modal";
import { Input, Label, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconPicker } from "@/components/ui/icon-picker";
import { ColorPicker } from "@/components/ui/color-picker";

const ACCOUNT_TYPES: { value: Account["type"]; label: string }[] = [
  { value: "wallet", label: "Carteira" },
  { value: "bank", label: "Conta Bancária" },
  { value: "mobile-money", label: "Dinheiro Móvel" },
  { value: "other", label: "Outro" },
];

export function AccountFormModal({
  open,
  onClose,
  account,
}: {
  open: boolean;
  onClose: () => void;
  account?: Account;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={account ? "Editar conta" : "Nova conta"}
      description="Defina os detalhes da sua conta financeira."
    >
      {/* Mounted fresh each time the modal opens, so form fields always start from the right values. */}
      {open && <AccountForm account={account} onClose={onClose} />}
    </Modal>
  );
}

function AccountForm({ account, onClose }: { account?: Account; onClose: () => void }) {
  const addAccount = useFinanceStore((s) => s.addAccount);
  const updateAccount = useFinanceStore((s) => s.updateAccount);
  const showToast = useToastStore((s) => s.show);

  const [name, setName] = useState(account?.name ?? "");
  const [type, setType] = useState<Account["type"]>(account?.type ?? "wallet");
  const [icon, setIcon] = useState<IconName>(account?.icon ?? "wallet");
  const [color, setColor] = useState(account?.color ?? "#6d5ef8");
  const [initialBalance, setInitialBalance] = useState(String(account?.initialBalance ?? 0));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      name: name.trim(),
      type,
      icon,
      color,
      initialBalance: Number(initialBalance) || 0,
    };
    if (account) {
      updateAccount(account.id, payload);
      showToast("Conta atualizada com sucesso.");
    } else {
      addAccount(payload);
      showToast("Conta criada com sucesso.");
    }
    onClose();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="account-name">Nome</Label>
        <Input
          id="account-name"
          required
          placeholder="Ex: Carteira, M-Pesa..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="account-type">Tipo</Label>
        <Select id="account-type" value={type} onChange={(e) => setType(e.target.value as Account["type"])}>
          {ACCOUNT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor="account-balance">Saldo inicial (MT)</Label>
        <Input
          id="account-balance"
          type="number"
          step="0.01"
          value={initialBalance}
          onChange={(e) => setInitialBalance(e.target.value)}
        />
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
        <Button type="submit">{account ? "Guardar alterações" : "Criar conta"}</Button>
      </div>
    </form>
  );
}
