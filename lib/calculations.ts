import { parseLocalDate } from "./date";
import type { Account, Budget, Category, Goal, Loan, Transaction, Transfer } from "./types";

export function getAccountBalance(
  account: Account,
  transactions: Transaction[],
  transfers: Transfer[] = [],
  loans: Loan[] = []
): number {
  const txDelta = transactions
    .filter((t) => t.accountId === account.id)
    // A taxa é um custo real que sai da conta, seja despesa ou receita —
    // em ambos os casos o saldo líquido é valor ∓ taxa.
    .reduce((sum, t) => sum + (t.type === "income" ? t.amount : -t.amount) - t.fee, 0);
  const transferDelta = transfers.reduce((sum, t) => {
    if (t.fromId === account.id) return sum - t.amount - t.fee;
    if (t.toId === account.id) return sum + t.amount;
    return sum;
  }, 0);
  // Receber um empréstimo (borrowed) entra na conta; conceder (lent) sai.
  // Os pagamentos fazem o movimento inverso na conta em que foram feitos.
  const loanDelta = loans.reduce((sum, l) => {
    let delta = 0;
    if (l.accountId === account.id) delta += l.direction === "borrowed" ? l.principal : -l.principal;
    for (const p of l.payments) {
      if (p.accountId === account.id) delta += l.direction === "borrowed" ? -p.amount : p.amount;
    }
    return sum + delta;
  }, 0);
  return account.initialBalance + txDelta + transferDelta + loanDelta;
}

export function getTotalBalance(
  accounts: Account[],
  transactions: Transaction[],
  transfers: Transfer[] = [],
  loans: Loan[] = []
): number {
  // Transfers move money between the user's own accounts, so the amount
  // nets to zero across the combined total — but any fee is a real cost
  // that leaves the total, deducted from the source account above.
  return accounts.reduce((sum, a) => sum + getAccountBalance(a, transactions, transfers, loans), 0);
}

export function isInMonth(dateStr: string, month: number, year: number): boolean {
  const d = parseLocalDate(dateStr);
  return d.getMonth() === month && d.getFullYear() === year;
}

export function isInRange(dateStr: string, start: Date, end: Date): boolean {
  const d = parseLocalDate(dateStr);
  return d >= start && d <= end;
}

export function getTransactionsForMonth(
  transactions: Transaction[],
  month: number,
  year: number
): Transaction[] {
  return transactions.filter((t) => isInMonth(t.date, month, year));
}

export interface MonthSummary {
  income: number;
  expense: number;
  fees: number;
  saved: number;
  savingsRate: number;
}

export function getMonthSummary(transactions: Transaction[]): MonthSummary {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount - t.fee, 0);
  // A despesa total inclui a taxa: é o que realmente saiu do bolso.
  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount + t.fee, 0);
  const fees = transactions.reduce((sum, t) => sum + t.fee, 0);
  const saved = income - expense;
  const savingsRate = income > 0 ? (saved / income) * 100 : 0;
  return { income, expense, fees, saved, savingsRate };
}

export interface CategoryBreakdownItem {
  category: Category;
  total: number;
  percentage: number;
  count: number;
}

export function getCategoryBreakdown(
  transactions: Transaction[],
  categories: Category[],
  type: "income" | "expense" = "expense"
): CategoryBreakdownItem[] {
  const filtered = transactions.filter((t) => t.type === type);
  const total = filtered.reduce((sum, t) => sum + t.amount, 0);
  const byCategory = new Map<string, { total: number; count: number }>();
  for (const t of filtered) {
    const entry = byCategory.get(t.categoryId) ?? { total: 0, count: 0 };
    entry.total += t.amount;
    entry.count += 1;
    byCategory.set(t.categoryId, entry);
  }
  const items: CategoryBreakdownItem[] = [];
  for (const [categoryId, entry] of byCategory.entries()) {
    const category = categories.find((c) => c.id === categoryId);
    if (!category) continue;
    items.push({
      category,
      total: entry.total,
      count: entry.count,
      percentage: total > 0 ? (entry.total / total) * 100 : 0,
    });
  }
  return items.sort((a, b) => b.total - a.total);
}

export interface MonthPoint {
  month: number;
  year: number;
  label: string;
  income: number;
  expense: number;
  balance: number;
}

export function getBalanceEvolution(
  accounts: Account[],
  transactions: Transaction[],
  monthsBack: number,
  referenceDate: Date = new Date()
): MonthPoint[] {
  const points: MonthPoint[] = [];
  const initialTotal = accounts.reduce((sum, a) => sum + a.initialBalance, 0);

  const sorted = [...transactions].sort(
    (a, b) => parseLocalDate(a.date).getTime() - parseLocalDate(b.date).getTime()
  );

  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - i, 1);
    const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
    const upToMonth = sorted.filter((t) => parseLocalDate(t.date) <= monthEnd);
    const balance =
      initialTotal +
      upToMonth.reduce(
        (sum, t) => sum + (t.type === "income" ? t.amount : -t.amount) - t.fee,
        0
      );

    const monthTx = getTransactionsForMonth(transactions, d.getMonth(), d.getFullYear());
    const { income, expense } = getMonthSummary(monthTx);

    const names = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];

    points.push({
      month: d.getMonth(),
      year: d.getFullYear(),
      label: names[d.getMonth()],
      income,
      expense,
      balance,
    });
  }

  return points;
}

export interface BudgetUsage {
  budget: Budget;
  category: Category;
  spent: number;
  remaining: number;
  percentage: number;
  status: "ok" | "warning" | "danger" | "exceeded";
}

export function getBudgetUsage(
  budgets: Budget[],
  categories: Category[],
  transactions: Transaction[]
): BudgetUsage[] {
  return budgets
    .map((budget) => {
      const category = categories.find((c) => c.id === budget.categoryId);
      if (!category) return null;
      const spent = transactions
        .filter(
          (t) =>
            t.categoryId === budget.categoryId &&
            t.type === "expense" &&
            isInMonth(t.date, budget.month, budget.year)
        )
        .reduce((sum, t) => sum + t.amount, 0);
      const percentage = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;
      let status: BudgetUsage["status"] = "ok";
      if (percentage >= 100) status = "exceeded";
      else if (percentage >= 90) status = "danger";
      else if (percentage >= 80) status = "warning";
      return {
        budget,
        category,
        spent,
        remaining: budget.limit - spent,
        percentage,
        status,
      };
    })
    .filter((b): b is BudgetUsage => b !== null);
}

export interface GoalProgress {
  goal: Goal;
  percentage: number;
  remaining: number;
  monthlyPaceEstimate: number | null;
  estimatedCompletionLabel: string | null;
  isCompleted: boolean;
  isOverdue: boolean;
}

export function getGoalProgress(goal: Goal, referenceDate: Date = new Date()): GoalProgress {
  const percentage = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
  const remaining = Math.max(goal.targetAmount - goal.currentAmount, 0);
  const isCompleted = goal.currentAmount >= goal.targetAmount;

  const createdAt = parseLocalDate(goal.createdAt);
  const monthsElapsed = Math.max(
    1,
    (referenceDate.getFullYear() - createdAt.getFullYear()) * 12 +
      (referenceDate.getMonth() - createdAt.getMonth()) +
      1
  );
  const monthlyPaceEstimate = isCompleted ? null : goal.currentAmount / monthsElapsed;

  let estimatedCompletionLabel: string | null = null;
  if (!isCompleted && monthlyPaceEstimate && monthlyPaceEstimate > 0) {
    const monthsNeeded = Math.ceil(remaining / monthlyPaceEstimate);
    const estDate = new Date(referenceDate);
    estDate.setMonth(estDate.getMonth() + monthsNeeded);
    const names = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];
    estimatedCompletionLabel = `${names[estDate.getMonth()]} de ${estDate.getFullYear()}`;
  } else if (!isCompleted) {
    estimatedCompletionLabel = "Sem ritmo de poupança suficiente";
  }

  const isOverdue = !isCompleted && !!goal.deadline && parseLocalDate(goal.deadline) < referenceDate;

  return {
    goal,
    percentage: Math.min(percentage, 100),
    remaining,
    monthlyPaceEstimate,
    estimatedCompletionLabel,
    isCompleted,
    isOverdue,
  };
}

export interface LoanSummary {
  loan: Loan;
  totalDue: number; // capital + juro simples
  paid: number;
  remaining: number;
  percentage: number;
  isSettled: boolean;
  isOverdue: boolean;
}

export function getLoanSummary(loan: Loan, referenceDate: Date = new Date()): LoanSummary {
  const totalDue = loan.principal * (1 + loan.interestRate / 100);
  const paid = loan.payments.reduce((sum, p) => sum + p.amount, 0);
  const remaining = Math.max(0, totalDue - paid);
  const isSettled = remaining <= 0.005;
  const isOverdue = !isSettled && !!loan.dueDate && parseLocalDate(loan.dueDate) < referenceDate;
  return {
    loan,
    totalDue,
    paid,
    remaining,
    percentage: totalDue > 0 ? Math.min(100, (paid / totalDue) * 100) : 0,
    isSettled,
    isOverdue,
  };
}
