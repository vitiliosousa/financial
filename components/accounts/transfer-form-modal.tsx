"use client";

import { useState } from "react";
import { useFinanceStore } from "@/lib/store";
import { useToastStore } from "@/lib/toast-store";
import { formatDateInput } from "@/lib/format";
import { Modal } from "@/components/ui/modal";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function TransferFormModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Transferir entre contas"
      description="Mova dinheiro de uma conta para outra sem afetar receitas ou despesas."
    >
      {open && <TransferForm onClose={onClose} />}
    </Modal>
  );
}

function TransferForm({ onClose }: { onClose: () => void }) {
  const accounts = useFinanceStore((s) => s.accounts);
  const addTransfer = useFinanceStore((s) => s.addTransfer);
  const showToast = useToastStore((s) => s.show);

  const [fromId, setFromId] = useState(accounts[0]?.id ?? "");
  const [toId, setToId] = useState(accounts[1]?.id ?? accounts[0]?.id ?? "");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(formatDateInput(new Date()));
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (fromId === toId) {
      setError("A conta de origem e destino devem ser diferentes.");
      return;
    }
    setError(null);
    addTransfer({
      fromId,
      toId,
      amount: Number(amount) || 0,
      date,
      description: description.trim() || undefined,
    });
    showToast("Transferência realizada com sucesso.");
    onClose();
  }

  if (accounts.length < 2) {
    return (
      <p className="text-sm text-muted-foreground">
        Precisa de pelo menos duas contas para transferir dinheiro entre elas.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="transfer-from">De</Label>
          <Select id="transfer-from" value={fromId} onChange={(e) => setFromId(e.target.value)} required>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="transfer-to">Para</Label>
          <Select id="transfer-to" value={toId} onChange={(e) => setToId(e.target.value)} required>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="transfer-amount">Valor (MT)</Label>
        <Input
          id="transfer-amount"
          type="number"
          step="0.01"
          min="0"
          required
          placeholder="0,00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="transfer-date">Data</Label>
        <Input id="transfer-date" type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      <div>
        <Label htmlFor="transfer-description">Descrição (opcional)</Label>
        <Textarea
          id="transfer-description"
          rows={2}
          placeholder="Ex: Poupança do mês"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {error && <p className="text-xs text-danger">{error}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit">Transferir</Button>
      </div>
    </form>
  );
}
