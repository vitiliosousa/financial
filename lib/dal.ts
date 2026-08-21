import "server-only";
import { prisma } from "./db";
import {
  serializeAccount,
  serializeBudget,
  serializeCategory,
  serializeGoal,
  serializeRecurring,
  serializeTransaction,
  serializeTransfer,
} from "./serialize";
import type {
  Account,
  Budget,
  Category,
  Goal,
  RecurringTransaction,
  Transaction,
  Transfer,
  UserProfile,
} from "./types";

export interface UserFinanceData {
  user: UserProfile;
  accounts: Account[];
  categories: Category[];
  transactions: Transaction[];
  recurringTransactions: RecurringTransaction[];
  transfers: Transfer[];
  budgets: Budget[];
  goals: Goal[];
}

export async function getUserFinanceData(userId: string): Promise<UserFinanceData> {
  const [user, accounts, categories, transactions, recurring, transfers, budgets, goals] =
    await Promise.all([
      prisma.user.findUniqueOrThrow({ where: { id: userId } }),
      prisma.account.findMany({ where: { userId }, orderBy: { createdAt: "asc" } }),
      prisma.category.findMany({ where: { userId }, orderBy: { name: "asc" } }),
      prisma.transaction.findMany({ where: { userId }, orderBy: { date: "desc" } }),
      prisma.recurringTransaction.findMany({ where: { userId }, orderBy: { startDate: "desc" } }),
      prisma.transfer.findMany({ where: { userId }, orderBy: { date: "desc" } }),
      prisma.budget.findMany({ where: { userId } }),
      prisma.goal.findMany({ where: { userId }, orderBy: { createdAt: "asc" } }),
    ]);

  return {
    user: { name: user.name, email: user.email, avatarColor: user.avatarColor },
    accounts: accounts.map(serializeAccount),
    categories: categories.map(serializeCategory),
    transactions: transactions.map(serializeTransaction),
    recurringTransactions: recurring.map(serializeRecurring),
    transfers: transfers.map(serializeTransfer),
    budgets: budgets.map(serializeBudget),
    goals: goals.map(serializeGoal),
  };
}
