import { toDateOnlyString } from "./date";
import type {
  Account as AccountRow,
  Budget as BudgetRow,
  Category as CategoryRow,
  Goal as GoalRow,
  RecurringTransaction as RecurringRow,
  Transaction as TransactionRow,
  Transfer as TransferRow,
} from "./generated/prisma/client";
import type {
  Account,
  Budget,
  Category,
  Goal,
  IconName,
  RecurringTransaction,
  Transaction,
  Transfer,
} from "./types";

export function serializeAccount(row: AccountRow): Account {
  return {
    id: row.id,
    name: row.name,
    type: row.type as Account["type"],
    icon: row.icon as IconName,
    color: row.color,
    initialBalance: Number(row.initialBalance),
    createdAt: toDateOnlyString(row.createdAt),
  };
}

export function serializeCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    type: row.type as Category["type"],
    color: row.color,
    icon: row.icon as IconName,
  };
}

export function serializeTransaction(row: TransactionRow): Transaction {
  return {
    id: row.id,
    type: row.type as Transaction["type"],
    amount: Number(row.amount),
    categoryId: row.categoryId,
    accountId: row.accountId,
    date: toDateOnlyString(row.date),
    description: row.description ?? undefined,
    recurringId: row.recurringId ?? undefined,
  };
}

export function serializeRecurring(row: RecurringRow): RecurringTransaction {
  return {
    id: row.id,
    type: row.type as RecurringTransaction["type"],
    amount: Number(row.amount),
    categoryId: row.categoryId,
    accountId: row.accountId,
    description: row.description ?? undefined,
    frequency: row.frequency as RecurringTransaction["frequency"],
    startDate: toDateOnlyString(row.startDate),
    endDate: row.endDate ? toDateOnlyString(row.endDate) : undefined,
    active: row.active,
    lastGeneratedDate: row.lastGeneratedDate ? toDateOnlyString(row.lastGeneratedDate) : undefined,
  };
}

export function serializeTransfer(row: TransferRow): Transfer {
  return {
    id: row.id,
    fromId: row.fromId,
    toId: row.toId,
    amount: Number(row.amount),
    date: toDateOnlyString(row.date),
    description: row.description ?? undefined,
  };
}

export function serializeBudget(row: BudgetRow): Budget {
  return {
    id: row.id,
    categoryId: row.categoryId,
    limit: Number(row.limit),
    month: row.month,
    year: row.year,
  };
}

export function serializeGoal(row: GoalRow): Goal {
  return {
    id: row.id,
    name: row.name,
    icon: row.icon as IconName,
    color: row.color,
    targetAmount: Number(row.targetAmount),
    currentAmount: Number(row.currentAmount),
    deadline: row.deadline ? toDateOnlyString(row.deadline) : undefined,
    createdAt: toDateOnlyString(row.createdAt),
  };
}
