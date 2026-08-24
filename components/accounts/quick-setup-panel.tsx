"use client";

import { useState } from "react";
import type { Account, Category, IconName, TransactionType } from "@/lib/types";
import { useFinanceStore } from "@/lib/store";
import { useToastStore } from "@/lib/toast-store";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { IconPicker } from "@/components/ui/icon-picker";
import { ColorPicker } from "@/components/ui/color-picker";
import { ICON_MAP } from "@/components/ui/icon";
import { MaterialIcon } from "@/components/ui/material-icon";
import { CATEGORIES } from "@/lib/mock-data";
import { cn } from "@/lib/cn";

// The app no longer seeds any categories at registration — every one of
// these (the full set that used to be created automatically) is offered
// here as an opt-in suggestion instead.
const CATEGORY_SUGGESTIONS: Omit<Category, "id">[] = CATEGORIES.map((c) => ({
  name: c.name,
  type: c.type,
  color: c.color,
  icon: c.icon,
}));

const GOAL_SUGGESTIONS: { name: string; icon: IconName; color: string }[] = [
  { name: "Fundo de emergência", icon: "piggy-bank", color: "#8fae6b" },
  { name: "Viagem", icon: "plane", color: "#6fa8dc" },
  { name: "Novo telemóvel", icon: "smartphone", color: "#a88fd1" },
  { name: "Carro novo", icon: "car", color: "#c9694f" },
];

const ACCOUNT_SUGGESTIONS: { name: string; type: Account["type"]; icon: IconName; color: string }[] = [
  { name: "Millennium BIM", type: "bank", icon: "landmark", color: "#d9a72c" },
  { name: "BCI", type: "bank", icon: "landmark", color: "#6fa8dc" },
  { name: "Standard Bank", type: "bank", icon: "landmark", color: "#5fa8b8" },
  { name: "Nedbank", type: "bank", icon: "landmark", color: "#c9694f" },
  { name: "FNB", type: "bank", icon: "landmark", color: "#9b6b9e" },
  { name: "Moza Banco", type: "bank", icon: "landmark", color: "#a88fd1" },
  { name: "Absa Bank", type: "bank", icon: "landmark", color: "#9a9548" },
  { name: "UBA", type: "bank", icon: "landmark", color: "#6bb3a0" },
  { name: "First Capital Bank", type: "bank", icon: "landmark", color: "#e8c468" },
  { name: "Access Bank", type: "bank", icon: "landmark", color: "#356599" },
  { name: "M-Pesa", type: "mobile-money", icon: "smartphone", color: "#e0916b" },
  { name: "e-Mola", type: "mobile-money", icon: "smartphone", color: "#d9738f" },
  { name: "Poupança", type: "bank", icon: "piggy-bank", color: "#8fae6b" },
];

const STEPS = [
  {
    key: "accounts",
    title: "Contas",
    icon: "account_balance_wallet",
    explain: "Indique as contas que tem — carteira, banco, dinheiro móvel — e os respetivos saldos.",
  },
  {
    key: "categories",
    title: "Categorias",
    icon: "sell",
    explain:
      "Categorias organizam as suas transações — por exemplo, ligar uma compra no supermercado a \"Alimentação\". Escolha algumas sugestões ou crie as suas.",
  },
  {
    key: "goals",
    title: "Metas financeiras",
    icon: "flag",
    explain:
      "Metas ajudam a poupar com um objetivo concreto em mente — por exemplo, juntar dinheiro para uma viagem ou um fundo de emergência.",
  },
  {
    key: "budgets",
    title: "Orçamentos",
    icon: "savings",
    explain:
      "Orçamentos definem quanto pretende gastar por categoria em cada mês, para acompanhar se está dentro do previsto.",
  },
] as const;

function CatIcon({ icon, color, size = 14 }: { icon: IconName; color: string; size?: number }) {
  return <MaterialIcon name={ICON_MAP[icon]} size={size} style={{ color }} />;
}

function PrivacyNote() {
  return (
    <div className="mb-4 flex items-start gap-2 rounded-[var(--radius-md)] border border-border bg-surface-hover px-3 py-2.5">
      <MaterialIcon name="lock" size={16} className="mt-0.5 shrink-0 text-muted-foreground" />
      <p className="text-xs text-muted-foreground">
        Os saldos que introduzir são privados — só você os vê. Nunca são partilhados, divulgados ou usados
        para outro fim.
      </p>
    </div>
  );
}

export function QuickSetupPanel({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isFirst = step === 0;
  const isLast = step === STEPS.length - 1;

  return (
    <div>
      <div className="mb-5 flex items-center gap-1.5">
        {STEPS.map((s, i) => (
          <div
            key={s.key}
            className={cn("h-1.5 flex-1 rounded-full transition-colors", i <= step ? "bg-accent" : "bg-border")}
          />
        ))}
      </div>

      <div className="mb-4 flex items-start gap-2">
        <MaterialIcon name={current.icon} size={18} className="mt-0.5 shrink-0 text-muted-foreground" />
        <div>
          <h3 className="text-sm font-semibold text-foreground">{current.title}</h3>
          <p className="text-xs text-muted-foreground">{current.explain}</p>
        </div>
      </div>

      {step === 0 && <AccountsQuickSection />}
      {step === 1 && <CategoriesQuickSection />}
      {step === 2 && <GoalsQuickSection />}
      {step === 3 && <BudgetsQuickSection />}

      <div className="mt-6 flex justify-between gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => (isFirst ? onDone() : setStep((s) => s - 1))}
        >
          {isFirst ? "Saltar tudo" : "Voltar"}
        </Button>
        <Button type="button" onClick={() => (isLast ? onDone() : setStep((s) => s + 1))}>
          {isLast ? "Concluir" : "Seguinte"}
        </Button>
      </div>
    </div>
  );
}

function AccountsQuickSection() {
  const accounts = useFinanceStore((s) => s.accounts);
  const addAccount = useFinanceStore((s) => s.addAccount);
  const showToast = useToastStore((s) => s.show);
  const [active, setActive] = useState<{ name: string; type: Account["type"]; icon: IconName; color: string } | null>(
    null
  );
  const [customOpen, setCustomOpen] = useState(false);
  const [added, setAdded] = useState<Set<string>>(new Set());

  // Frozen at mount: the accounts that already exist when this step opens
  // (e.g. the default "Carteira" created at registration) are edited in
  // place below, and excluded from the "add a new one" suggestions.
  const [existingAccounts] = useState(accounts);
  const existingNames = new Set(existingAccounts.map((a) => a.name.trim().toLowerCase()));
  const suggestions = ACCOUNT_SUGGESTIONS.filter((s) => !existingNames.has(s.name.toLowerCase()));

  function addSuggestion(name: string, type: Account["type"], icon: IconName, color: string, initialBalance: number) {
    addAccount({ name, type, icon, color, initialBalance });
    setAdded((prev) => new Set(prev).add(name));
    showToast(`Conta "${name}" adicionada.`);
    setActive(null);
    setCustomOpen(false);
  }

  return (
    <section>
      <PrivacyNote />

      {existingAccounts.length > 0 && (
        <div className="mb-4 space-y-2">
          {existingAccounts.map((account) => (
            <ExistingAccountRow key={account.id} account={account} />
          ))}
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => {
            const isAdded = added.has(s.name);
            return (
              <button
                key={s.name}
                type="button"
                disabled={isAdded}
                onClick={() => setActive(s)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  isAdded
                    ? "border-transparent bg-success-soft text-success"
                    : "border-border text-foreground hover:bg-surface-hover"
                )}
              >
                {isAdded ? <MaterialIcon name="check" size={14} /> : <CatIcon icon={s.icon} color={s.color} />}
                {s.name}
              </button>
            );
          })}
        </div>
      )}

      {active && (
        <AccountAmountForm
          name={active.name}
          icon={active.icon}
          color={active.color}
          onCancel={() => setActive(null)}
          onConfirm={(balance) => addSuggestion(active.name, active.type, active.icon, active.color, balance)}
        />
      )}

      <button
        type="button"
        onClick={() => setCustomOpen((v) => !v)}
        className="mt-3 text-xs font-medium text-accent hover:underline"
      >
        {customOpen ? "Cancelar" : "+ Conta personalizada"}
      </button>

      {customOpen && (
        <CustomAccountForm
          onAdd={(name, type, icon, color, balance) => addSuggestion(name, type, icon, color, balance)}
        />
      )}
    </section>
  );
}

function ExistingAccountRow({ account }: { account: Account }) {
  const updateAccount = useFinanceStore((s) => s.updateAccount);
  const showToast = useToastStore((s) => s.show);
  const [name, setName] = useState(account.name);
  const [balance, setBalance] = useState(String(account.initialBalance));
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    updateAccount(account.id, { name: name.trim() || account.name, initialBalance: Number(balance) || 0 });
    showToast("Conta atualizada.");
    setDirty(false);
    setSaved(true);
  }

  return (
    <div className="rounded-[var(--radius-md)] border border-border p-3">
      <div className="flex items-center gap-2">
        <CatIcon icon={account.icon} color={account.color} size={18} />
        <Input
          aria-label="Nome da conta"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setDirty(true);
            setSaved(false);
          }}
          className="h-9 min-w-0 flex-1 text-sm"
        />
      </div>
      <div className="mt-2 flex items-center gap-2">
        <Input
          aria-label="Saldo"
          type="number"
          step="0.01"
          placeholder="Saldo (MT)"
          value={balance}
          onChange={(e) => {
            setBalance(e.target.value);
            setDirty(true);
            setSaved(false);
          }}
          className="h-9 min-w-0 flex-1 text-sm"
        />
        {saved && !dirty ? (
          <MaterialIcon name="check" size={18} className="shrink-0 text-success" />
        ) : (
          <Button type="button" variant="outline" size="sm" disabled={!dirty} onClick={handleSave} className="shrink-0">
            Guardar
          </Button>
        )}
      </div>
    </div>
  );
}

function AccountAmountForm({
  name,
  icon,
  color,
  onCancel,
  onConfirm,
}: {
  name: string;
  icon: IconName;
  color: string;
  onCancel: () => void;
  onConfirm: (balance: number) => void;
}) {
  const [amount, setAmount] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onConfirm(Number(amount) || 0);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-3 flex items-end gap-2 rounded-[var(--radius-md)] border border-border p-3"
    >
      <div className="flex-1">
        <Label htmlFor="quick-account-amount">
          <span className="inline-flex items-center gap-1.5">
            <CatIcon icon={icon} color={color} />
            {name} — saldo atual (MT)
          </span>
        </Label>
        <Input
          id="quick-account-amount"
          type="number"
          step="0.01"
          autoFocus
          placeholder="0,00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <Button type="button" variant="outline" size="sm" onClick={onCancel}>
        Cancelar
      </Button>
      <Button type="submit" size="sm">
        Adicionar
      </Button>
    </form>
  );
}

function CustomAccountForm({
  onAdd,
}: {
  onAdd: (name: string, type: Account["type"], icon: IconName, color: string, balance: number) => void;
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState<Account["type"]>("wallet");
  const [amount, setAmount] = useState("");
  const [icon, setIcon] = useState<IconName>("wallet");
  const [color, setColor] = useState("#d9a72c");

  const ACCOUNT_TYPES: { value: Account["type"]; label: string }[] = [
    { value: "wallet", label: "Carteira" },
    { value: "bank", label: "Conta Bancária" },
    { value: "mobile-money", label: "Dinheiro Móvel" },
    { value: "other", label: "Outro" },
  ];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name.trim(), type, icon, color, Number(amount) || 0);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-3 rounded-[var(--radius-md)] border border-border p-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="quick-acc-name">Nome</Label>
          <Input
            id="quick-acc-name"
            required
            placeholder="Ex: Standard Bank"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="quick-acc-balance">Saldo atual (MT)</Label>
          <Input
            id="quick-acc-balance"
            type="number"
            step="0.01"
            placeholder="0,00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="quick-acc-type">Tipo</Label>
        <Select id="quick-acc-type" value={type} onChange={(e) => setType(e.target.value as Account["type"])}>
          {ACCOUNT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </Select>
      </div>
      <ColorPicker value={color} onChange={setColor} />
      <IconPicker value={icon} onChange={setIcon} color={color} />
      <div className="flex justify-end">
        <Button type="submit" size="sm">
          Adicionar conta
        </Button>
      </div>
    </form>
  );
}

function CategoriesQuickSection() {
  const categories = useFinanceStore((s) => s.categories);
  const addCategory = useFinanceStore((s) => s.addCategory);
  const showToast = useToastStore((s) => s.show);
  const [customOpen, setCustomOpen] = useState(false);
  const [added, setAdded] = useState<Set<string>>(new Set());

  // Frozen at mount so a suggestion stays visible (with its "added" check)
  // after being picked, instead of disappearing as soon as the store
  // updates — only categories that already existed before this screen
  // opened are excluded.
  const [existingNames] = useState(() => new Set(categories.map((c) => c.name.trim().toLowerCase())));
  const suggestions = CATEGORY_SUGGESTIONS.filter((c) => !existingNames.has(c.name.toLowerCase()));

  function addSuggestion(s: Omit<Category, "id">) {
    addCategory(s);
    setAdded((prev) => new Set(prev).add(s.name));
    showToast(`Categoria "${s.name}" adicionada.`);
  }

  return (
    <section>
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => {
            const isAdded = added.has(s.name);
            return (
              <button
                key={s.name}
                type="button"
                disabled={isAdded}
                onClick={() => addSuggestion(s)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  isAdded
                    ? "border-transparent bg-success-soft text-success"
                    : "border-border text-foreground hover:bg-surface-hover"
                )}
              >
                {isAdded ? <MaterialIcon name="check" size={14} /> : <CatIcon icon={s.icon} color={s.color} />}
                {s.name}
              </button>
            );
          })}
        </div>
      )}

      <button
        type="button"
        onClick={() => setCustomOpen((v) => !v)}
        className="mt-3 text-xs font-medium text-accent hover:underline"
      >
        {customOpen ? "Cancelar" : "+ Categoria personalizada"}
      </button>

      {customOpen && (
        <CustomCategoryForm
          onAdd={(payload) => {
            addCategory(payload);
            showToast(`Categoria "${payload.name}" adicionada.`);
            setCustomOpen(false);
          }}
        />
      )}
    </section>
  );
}

function CustomCategoryForm({ onAdd }: { onAdd: (payload: Omit<Category, "id">) => void }) {
  const [name, setName] = useState("");
  const [type, setType] = useState<TransactionType>("expense");
  const [icon, setIcon] = useState<IconName>("coins");
  const [color, setColor] = useState("#d9a72c");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ name: name.trim(), type, icon, color });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-3 rounded-[var(--radius-md)] border border-border p-3">
      <div>
        <Label htmlFor="quick-cat-name">Nome</Label>
        <Input
          id="quick-cat-name"
          required
          placeholder="Ex: Ginásio"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setType("expense")}
          className={cn(
            "h-9 rounded-[var(--radius-sm)] border text-xs font-medium transition-colors",
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
            "h-9 rounded-[var(--radius-sm)] border text-xs font-medium transition-colors",
            type === "income"
              ? "border-success/40 bg-success-soft text-success"
              : "border-border text-muted-foreground hover:bg-surface-hover"
          )}
        >
          Receita
        </button>
      </div>
      <ColorPicker value={color} onChange={setColor} />
      <IconPicker value={icon} onChange={setIcon} color={color} />
      <div className="flex justify-end">
        <Button type="submit" size="sm">
          Adicionar categoria
        </Button>
      </div>
    </form>
  );
}

function GoalsQuickSection() {
  const addGoal = useFinanceStore((s) => s.addGoal);
  const showToast = useToastStore((s) => s.show);
  const [active, setActive] = useState<{ name: string; icon: IconName; color: string } | null>(null);
  const [customOpen, setCustomOpen] = useState(false);
  const [added, setAdded] = useState<Set<string>>(new Set());

  function confirmGoal(name: string, icon: IconName, color: string, targetAmount: number) {
    addGoal({ name, icon, color, targetAmount, currentAmount: 0, deadline: undefined });
    setAdded((prev) => new Set(prev).add(name));
    showToast(`Meta "${name}" criada.`);
    setActive(null);
    setCustomOpen(false);
  }

  return (
    <section>
      <div className="flex flex-wrap gap-2">
        {GOAL_SUGGESTIONS.map((s) => {
          const isAdded = added.has(s.name);
          return (
            <button
              key={s.name}
              type="button"
              disabled={isAdded}
              onClick={() => setActive(s)}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                isAdded
                  ? "border-transparent bg-success-soft text-success"
                  : "border-border text-foreground hover:bg-surface-hover"
              )}
            >
              {isAdded ? <MaterialIcon name="check" size={14} /> : <CatIcon icon={s.icon} color={s.color} />}
              {s.name}
            </button>
          );
        })}
      </div>

      {active && (
        <GoalAmountForm
          name={active.name}
          icon={active.icon}
          color={active.color}
          onCancel={() => setActive(null)}
          onConfirm={(targetAmount) => confirmGoal(active.name, active.icon, active.color, targetAmount)}
        />
      )}

      <button
        type="button"
        onClick={() => setCustomOpen((v) => !v)}
        className="mt-3 text-xs font-medium text-accent hover:underline"
      >
        {customOpen ? "Cancelar" : "+ Meta personalizada"}
      </button>

      {customOpen && (
        <CustomGoalForm
          onAdd={(name, icon, color, targetAmount) => confirmGoal(name, icon, color, targetAmount)}
        />
      )}
    </section>
  );
}

function GoalAmountForm({
  name,
  icon,
  color,
  onCancel,
  onConfirm,
}: {
  name: string;
  icon: IconName;
  color: string;
  onCancel: () => void;
  onConfirm: (targetAmount: number) => void;
}) {
  const [amount, setAmount] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = Number(amount);
    if (!value || value <= 0) return;
    onConfirm(value);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-3 flex items-end gap-2 rounded-[var(--radius-md)] border border-border p-3"
    >
      <div className="flex-1">
        <Label htmlFor="quick-goal-amount">
          <span className="inline-flex items-center gap-1.5">
            <CatIcon icon={icon} color={color} />
            {name} — valor objetivo (MT)
          </span>
        </Label>
        <Input
          id="quick-goal-amount"
          type="number"
          step="0.01"
          min="0"
          required
          autoFocus
          placeholder="0,00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <Button type="button" variant="outline" size="sm" onClick={onCancel}>
        Cancelar
      </Button>
      <Button type="submit" size="sm">
        Adicionar
      </Button>
    </form>
  );
}

function CustomGoalForm({
  onAdd,
}: {
  onAdd: (name: string, icon: IconName, color: string, targetAmount: number) => void;
}) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [icon, setIcon] = useState<IconName>("target");
  const [color, setColor] = useState("#d9a72c");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = Number(amount);
    if (!name.trim() || !value || value <= 0) return;
    onAdd(name.trim(), icon, color, value);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-3 rounded-[var(--radius-md)] border border-border p-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="quick-goal-name">Nome</Label>
          <Input
            id="quick-goal-name"
            required
            placeholder="Ex: Casamento"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="quick-goal-custom-amount">Valor objetivo (MT)</Label>
          <Input
            id="quick-goal-custom-amount"
            type="number"
            step="0.01"
            min="0"
            required
            placeholder="0,00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
      </div>
      <ColorPicker value={color} onChange={setColor} />
      <IconPicker value={icon} onChange={setIcon} color={color} />
      <div className="flex justify-end">
        <Button type="submit" size="sm">
          Adicionar meta
        </Button>
      </div>
    </form>
  );
}

function BudgetsQuickSection() {
  const categories = useFinanceStore((s) => s.categories);
  const budgets = useFinanceStore((s) => s.budgets);
  const addBudget = useFinanceStore((s) => s.addBudget);
  const showToast = useToastStore((s) => s.show);

  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  // Frozen at mount for the same reason as the categories step: a row
  // should stay visible (showing its checkmark) after being saved, instead
  // of disappearing the instant its budget lands in the store.
  const [candidates] = useState(() => {
    const budgetedIds = new Set(
      budgets.filter((b) => b.month === month && b.year === year).map((b) => b.categoryId)
    );
    return categories.filter((c) => c.type === "expense" && !budgetedIds.has(c.id));
  });

  const [limits, setLimits] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState<Set<string>>(new Set());

  function handleSave() {
    let count = 0;
    for (const [categoryId, raw] of Object.entries(limits)) {
      const value = Number(raw);
      if (!value || value <= 0 || saved.has(categoryId)) continue;
      addBudget({ categoryId, limit: value, month, year });
      count++;
    }
    if (count > 0) {
      setSaved((prev) => new Set([...prev, ...Object.keys(limits)]));
      showToast(count === 1 ? "Orçamento definido." : `${count} orçamentos definidos.`);
    }
  }

  if (candidates.length === 0) {
    return (
      <section>
        <p className="text-xs text-muted-foreground">
          Sem categorias de despesa disponíveis ainda — volte atrás e crie uma para poder orçamentá-la.
        </p>
      </section>
    );
  }

  return (
    <section>
      <div className="space-y-2">
        {candidates.map((c) => {
          const isSaved = saved.has(c.id);
          return (
            <div key={c.id} className="flex items-center gap-3">
              <div className="flex flex-1 items-center gap-2 text-sm text-foreground">
                <CatIcon icon={c.icon} color={c.color} size={16} />
                {c.name}
              </div>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="Sem limite"
                disabled={isSaved}
                value={limits[c.id] ?? ""}
                onChange={(e) => setLimits((prev) => ({ ...prev, [c.id]: e.target.value }))}
                className="h-9 w-32 text-xs"
              />
              {isSaved && <MaterialIcon name="check" size={16} className="shrink-0 text-success" />}
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex justify-end">
        <Button type="button" variant="outline" size="sm" onClick={handleSave}>
          Guardar orçamentos
        </Button>
      </div>
    </section>
  );
}
