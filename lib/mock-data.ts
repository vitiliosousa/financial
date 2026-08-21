import { parseLocalDate } from "./date";
import { createSeededRandom } from "./seeded-random";
import type {
  Account,
  Budget,
  Category,
  Goal,
  RecurringTransaction,
  Transaction,
  UserProfile,
} from "./types";

const random = createSeededRandom(42);

const now = new Date();
const TODAY = new Date(now.getFullYear(), now.getMonth(), now.getDate());

export const CURRENT_USER: UserProfile = {
  name: "Vitílio Martins",
  email: "vitiliomartins2003@gmail.com",
  avatarColor: "#6366f1",
};

export const ACCOUNTS: Account[] = [
  {
    id: "acc-wallet",
    name: "Carteira",
    type: "wallet",
    icon: "wallet",
    color: "#f59e0b",
    initialBalance: 42000,
    createdAt: "2026-01-05",
  },
  {
    id: "acc-bank",
    name: "Conta Bancária",
    type: "bank",
    icon: "landmark",
    color: "#3b82f6",
    initialBalance: 25000,
    createdAt: "2026-01-05",
  },
  {
    id: "acc-mpesa",
    name: "M-Pesa",
    type: "mobile-money",
    icon: "smartphone",
    color: "#ef4444",
    initialBalance: 4000,
    createdAt: "2026-01-05",
  },
  {
    id: "acc-emola",
    name: "e-Mola",
    type: "mobile-money",
    icon: "smartphone",
    color: "#f97316",
    initialBalance: 22000,
    createdAt: "2026-01-05",
  },
];

export const CATEGORIES: Category[] = [
  { id: "cat-salario", name: "Salário", type: "income", color: "#d9a72c", icon: "briefcase" },
  { id: "cat-freelance", name: "Freelance", type: "income", color: "#6bb3a0", icon: "trending-up" },
  { id: "cat-outros-rend", name: "Outros Rendimentos", type: "income", color: "#e8c468", icon: "coins" },
  { id: "cat-alimentacao", name: "Alimentação", type: "expense", color: "#c9694f", icon: "utensils" },
  { id: "cat-transporte", name: "Transporte", type: "expense", color: "#6fa8dc", icon: "car" },
  { id: "cat-internet", name: "Internet", type: "expense", color: "#5fa8b8", icon: "wifi" },
  { id: "cat-lazer", name: "Lazer", type: "expense", color: "#d9738f", icon: "gamepad-2" },
  { id: "cat-casa", name: "Casa / Renda", type: "expense", color: "#9b6b9e", icon: "home" },
  { id: "cat-saude", name: "Saúde", type: "expense", color: "#e0916b", icon: "heart-pulse" },
  { id: "cat-educacao", name: "Educação", type: "expense", color: "#a88fd1", icon: "graduation-cap" },
  { id: "cat-vestuario", name: "Vestuário", type: "expense", color: "#9a9548", icon: "shirt" },
  { id: "cat-viagens", name: "Viagens", type: "expense", color: "#8fae6b", icon: "plane" },
  { id: "cat-presentes", name: "Presentes", type: "expense", color: "#d9738f", icon: "gift" },
  { id: "cat-compras", name: "Compras", type: "expense", color: "#a88fd1", icon: "shopping-cart" },
  { id: "cat-subscricoes", name: "Subscrições", type: "expense", color: "#5fa8b8", icon: "receipt" },
  { id: "cat-ginasio", name: "Ginásio", type: "expense", color: "#e0916b", icon: "dumbbell" },
];

function categoryById(id: string) {
  return CATEGORIES.find((c) => c.id === id)!;
}

const EXPENSE_CATEGORY_WEIGHTS: { id: string; weight: number; min: number; max: number; bigTicket?: boolean }[] = [
  { id: "cat-alimentacao", weight: 10, min: 150, max: 1200 },
  { id: "cat-transporte", weight: 8, min: 50, max: 600 },
  { id: "cat-lazer", weight: 5, min: 200, max: 1500 },
  { id: "cat-compras", weight: 4, min: 300, max: 2500, bigTicket: true },
  { id: "cat-saude", weight: 2, min: 200, max: 3000, bigTicket: true },
  { id: "cat-vestuario", weight: 2, min: 500, max: 3500, bigTicket: true },
  { id: "cat-presentes", weight: 2, min: 200, max: 1500, bigTicket: true },
  { id: "cat-educacao", weight: 2, min: 500, max: 2500, bigTicket: true },
];

function weightedPick<T extends { weight: number }>(items: T[]): T {
  const total = items.reduce((sum, i) => sum + i.weight, 0);
  let r = random() * total;
  for (const item of items) {
    r -= item.weight;
    if (r <= 0) return item;
  }
  return items[items.length - 1];
}

function pickAccount(bigTicket = false): string {
  const r = random();
  if (bigTicket) {
    if (r < 0.8) return "acc-bank";
    if (r < 0.9) return "acc-wallet";
    if (r < 0.97) return "acc-mpesa";
    return "acc-emola";
  }
  if (r < 0.45) return "acc-bank";
  if (r < 0.68) return "acc-wallet";
  if (r < 0.88) return "acc-mpesa";
  return "acc-emola";
}

const DESCRIPTIONS: Record<string, string[]> = {
  "cat-alimentacao": ["Supermercado Shoprite", "Mercado Municipal", "Restaurante", "Padaria", "Take-away"],
  "cat-transporte": ["Chapa", "Combustível", "Uber", "Táxi", "Estacionamento"],
  "cat-lazer": ["Cinema", "Bar com amigos", "Concerto", "Praia", "Jogo de futebol"],
  "cat-compras": ["Roupas novas", "Eletrónica", "Loja online", "Presente para casa"],
  "cat-saude": ["Consulta médica", "Farmácia", "Exames", "Dentista"],
  "cat-vestuario": ["Loja de roupa", "Sapataria", "Boutique"],
  "cat-presentes": ["Aniversário", "Presente de casamento", "Lembrança"],
  "cat-educacao": ["Curso online", "Livros", "Material escolar"],
  "cat-ginasio": ["Mensalidade do ginásio"],
};

function randomDescription(categoryId: string): string {
  const options = DESCRIPTIONS[categoryId];
  if (!options) return "";
  return options[Math.floor(random() * options.length)];
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function toISO(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
}

const MONTHS_OF_HISTORY = 6;
const historyStart = addMonths(TODAY, -MONTHS_OF_HISTORY);

const transactions: Transaction[] = [];
let txCounter = 0;
function nextTxId() {
  txCounter += 1;
  return `tx-${txCounter}`;
}

// Recurring transactions definitions
export const RECURRING_TRANSACTIONS: RecurringTransaction[] = [
  {
    id: "rec-salario",
    type: "income",
    amount: 45000,
    categoryId: "cat-salario",
    accountId: "acc-bank",
    description: "Salário mensal",
    frequency: "monthly",
    startDate: toISO(historyStart),
    active: true,
  },
  {
    id: "rec-renda",
    type: "expense",
    amount: 8000,
    categoryId: "cat-casa",
    accountId: "acc-bank",
    description: "Renda de casa",
    frequency: "monthly",
    startDate: toISO(historyStart),
    active: true,
  },
  {
    id: "rec-internet",
    type: "expense",
    amount: 1999,
    categoryId: "cat-internet",
    accountId: "acc-bank",
    description: "Internet fixa",
    frequency: "monthly",
    startDate: toISO(historyStart),
    active: true,
  },
  {
    id: "rec-subscricao-streaming",
    type: "expense",
    amount: 499,
    categoryId: "cat-subscricoes",
    accountId: "acc-emola",
    description: "Subscrição de streaming",
    frequency: "monthly",
    startDate: toISO(historyStart),
    active: true,
  },
  {
    id: "rec-ginasio",
    type: "expense",
    amount: 800,
    categoryId: "cat-ginasio",
    accountId: "acc-wallet",
    description: "Mensalidade do ginásio",
    frequency: "monthly",
    startDate: toISO(historyStart),
    active: true,
  },
  {
    id: "rec-freelance",
    type: "income",
    amount: 6000,
    categoryId: "cat-freelance",
    accountId: "acc-mpesa",
    description: "Projeto freelance recorrente",
    frequency: "monthly",
    startDate: toISO(addMonths(historyStart, 1)),
    active: true,
  },
];

// Generate recurring occurrences from startDate up to today
for (const rec of RECURRING_TRANSACTIONS) {
  let cursor = parseLocalDate(rec.startDate);
  while (cursor <= TODAY) {
    transactions.push({
      id: nextTxId(),
      type: rec.type,
      amount: rec.amount,
      categoryId: rec.categoryId,
      accountId: rec.accountId,
      date: toISO(cursor),
      description: rec.description,
      recurringId: rec.id,
    });
    if (rec.frequency === "monthly") cursor = addMonths(cursor, 1);
    else if (rec.frequency === "yearly") cursor = addMonths(cursor, 12);
    else if (rec.frequency === "weekly") cursor = addDays(cursor, 7);
    else cursor = addDays(cursor, 1);
  }
}

// Generate random day-to-day expenses / occasional extra income
let dayCursor = new Date(historyStart);
while (dayCursor <= TODAY) {
  const numTx = random() < 0.55 ? 1 : random() < 0.85 ? 2 : 0;
  for (let i = 0; i < numTx; i++) {
    const isIncome = random() < 0.06;
    if (isIncome) {
      transactions.push({
        id: nextTxId(),
        type: "income",
        amount: Math.round(500 + random() * 3000),
        categoryId: "cat-outros-rend",
        accountId: pickAccount(),
        date: toISO(dayCursor),
        description: "Rendimento extra",
      });
    } else {
      const picked = weightedPick(EXPENSE_CATEGORY_WEIGHTS);
      const amount = Math.round(picked.min + random() * (picked.max - picked.min));
      transactions.push({
        id: nextTxId(),
        type: "expense",
        amount,
        categoryId: picked.id,
        accountId: pickAccount(picked.bigTicket),
        date: toISO(dayCursor),
        description: randomDescription(picked.id),
      });
    }
  }
  dayCursor = addDays(dayCursor, 1);
}

transactions.sort((a, b) => (a.date < b.date ? 1 : -1));

export const TRANSACTIONS: Transaction[] = transactions;

const currentMonth = TODAY.getMonth();
const currentYear = TODAY.getFullYear();

export const BUDGETS: Budget[] = [
  { id: "bud-alimentacao", categoryId: "cat-alimentacao", limit: 15000, month: currentMonth, year: currentYear },
  { id: "bud-transporte", categoryId: "cat-transporte", limit: 5000, month: currentMonth, year: currentYear },
  { id: "bud-lazer", categoryId: "cat-lazer", limit: 4000, month: currentMonth, year: currentYear },
  { id: "bud-compras", categoryId: "cat-compras", limit: 6000, month: currentMonth, year: currentYear },
  { id: "bud-saude", categoryId: "cat-saude", limit: 3000, month: currentMonth, year: currentYear },
  { id: "bud-ginasio", categoryId: "cat-ginasio", limit: 900, month: currentMonth, year: currentYear },
];

export const GOALS: Goal[] = [
  {
    id: "goal-emergencia",
    name: "Fundo de Emergência",
    icon: "piggy-bank",
    color: "#22c55e",
    targetAmount: 60000,
    currentAmount: 38500,
    deadline: toISO(addMonths(TODAY, 4)),
    createdAt: toISO(addMonths(TODAY, -6)),
  },
  {
    id: "goal-viagem",
    name: "Viagem a Zanzibar",
    icon: "plane",
    color: "#06b6d4",
    targetAmount: 35000,
    currentAmount: 14200,
    deadline: toISO(addMonths(TODAY, 6)),
    createdAt: toISO(addMonths(TODAY, -3)),
  },
  {
    id: "goal-carro",
    name: "Entrada do Carro",
    icon: "sparkles",
    color: "#f59e0b",
    targetAmount: 150000,
    currentAmount: 42000,
    deadline: toISO(addMonths(TODAY, 14)),
    createdAt: toISO(addMonths(TODAY, -5)),
  },
  {
    id: "goal-portatil",
    name: "Novo Portátil",
    icon: "target",
    color: "#8b5cf6",
    targetAmount: 45000,
    currentAmount: 45000,
    deadline: toISO(addMonths(TODAY, -1)),
    createdAt: toISO(addMonths(TODAY, -4)),
  },
];

export { categoryById };
