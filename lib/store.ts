"use client";

import { create } from "zustand";
import { formatDateInput } from "./format";
import {
  ACCOUNTS,
  BUDGETS,
  CATEGORIES,
  CURRENT_USER,
  GOALS,
  RECURRING_TRANSACTIONS,
  TRANSACTIONS,
} from "./mock-data";
import type {
  Account,
  Budget,
  Category,
  Goal,
  RecurringTransaction,
  Transaction,
  UserProfile,
} from "./types";

let idCounter = 1000;
function generateId(prefix: string) {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

interface FinanceState {
  accounts: Account[];
  categories: Category[];
  transactions: Transaction[];
  recurringTransactions: RecurringTransaction[];
  budgets: Budget[];
  goals: Goal[];
  user: UserProfile;

  addAccount: (account: Omit<Account, "id" | "createdAt">) => void;
  updateAccount: (id: string, account: Partial<Omit<Account, "id">>) => void;
  deleteAccount: (id: string) => void;

  addCategory: (category: Omit<Category, "id">) => void;
  updateCategory: (id: string, category: Partial<Omit<Category, "id">>) => void;
  deleteCategory: (id: string) => void;

  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  updateTransaction: (id: string, transaction: Partial<Omit<Transaction, "id">>) => void;
  deleteTransaction: (id: string) => void;

  addRecurring: (recurring: Omit<RecurringTransaction, "id">) => void;
  updateRecurring: (id: string, recurring: Partial<Omit<RecurringTransaction, "id">>) => void;
  deleteRecurring: (id: string) => void;

  addBudget: (budget: Omit<Budget, "id">) => void;
  updateBudget: (id: string, budget: Partial<Omit<Budget, "id">>) => void;
  deleteBudget: (id: string) => void;

  addGoal: (goal: Omit<Goal, "id" | "createdAt">) => void;
  updateGoal: (id: string, goal: Partial<Omit<Goal, "id">>) => void;
  deleteGoal: (id: string) => void;
  contributeToGoal: (id: string, amount: number) => void;

  updateUser: (user: Partial<UserProfile>) => void;
}

export const useFinanceStore = create<FinanceState>((set) => ({
  accounts: ACCOUNTS,
  categories: CATEGORIES,
  transactions: TRANSACTIONS,
  recurringTransactions: RECURRING_TRANSACTIONS,
  budgets: BUDGETS,
  goals: GOALS,
  user: CURRENT_USER,

  addAccount: (account) =>
    set((state) => ({
      accounts: [
        ...state.accounts,
        { ...account, id: generateId("acc"), createdAt: formatDateInput(new Date()) },
      ],
    })),
  updateAccount: (id, account) =>
    set((state) => ({
      accounts: state.accounts.map((a) => (a.id === id ? { ...a, ...account } : a)),
    })),
  deleteAccount: (id) =>
    set((state) => ({
      accounts: state.accounts.filter((a) => a.id !== id),
      transactions: state.transactions.filter((t) => t.accountId !== id),
    })),

  addCategory: (category) =>
    set((state) => ({
      categories: [...state.categories, { ...category, id: generateId("cat") }],
    })),
  updateCategory: (id, category) =>
    set((state) => ({
      categories: state.categories.map((c) => (c.id === id ? { ...c, ...category } : c)),
    })),
  deleteCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
      transactions: state.transactions.filter((t) => t.categoryId !== id),
      budgets: state.budgets.filter((b) => b.categoryId !== id),
    })),

  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [{ ...transaction, id: generateId("tx") }, ...state.transactions],
    })),
  updateTransaction: (id, transaction) =>
    set((state) => ({
      transactions: state.transactions.map((t) => (t.id === id ? { ...t, ...transaction } : t)),
    })),
  deleteTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    })),

  addRecurring: (recurring) =>
    set((state) => ({
      recurringTransactions: [
        ...state.recurringTransactions,
        { ...recurring, id: generateId("rec") },
      ],
    })),
  updateRecurring: (id, recurring) =>
    set((state) => ({
      recurringTransactions: state.recurringTransactions.map((r) =>
        r.id === id ? { ...r, ...recurring } : r
      ),
    })),
  deleteRecurring: (id) =>
    set((state) => ({
      recurringTransactions: state.recurringTransactions.filter((r) => r.id !== id),
    })),

  addBudget: (budget) =>
    set((state) => ({
      budgets: [...state.budgets, { ...budget, id: generateId("bud") }],
    })),
  updateBudget: (id, budget) =>
    set((state) => ({
      budgets: state.budgets.map((b) => (b.id === id ? { ...b, ...budget } : b)),
    })),
  deleteBudget: (id) =>
    set((state) => ({
      budgets: state.budgets.filter((b) => b.id !== id),
    })),

  addGoal: (goal) =>
    set((state) => ({
      goals: [
        ...state.goals,
        { ...goal, id: generateId("goal"), createdAt: formatDateInput(new Date()) },
      ],
    })),
  updateGoal: (id, goal) =>
    set((state) => ({
      goals: state.goals.map((g) => (g.id === id ? { ...g, ...goal } : g)),
    })),
  deleteGoal: (id) =>
    set((state) => ({
      goals: state.goals.filter((g) => g.id !== id),
    })),
  contributeToGoal: (id, amount) =>
    set((state) => ({
      goals: state.goals.map((g) =>
        g.id === id ? { ...g, currentAmount: g.currentAmount + amount } : g
      ),
    })),

  updateUser: (user) =>
    set((state) => ({
      user: { ...state.user, ...user },
    })),
}));
