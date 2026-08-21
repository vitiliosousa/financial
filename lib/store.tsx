"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { createStore, type StoreApi } from "zustand/vanilla";
import { useStore } from "zustand/react";
import { formatDateInput } from "./format";
import { useToastStore } from "./toast-store";
import type { UserFinanceData } from "./dal";
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
import { createAccountAction, deleteAccountAction, updateAccountAction } from "./actions/accounts";
import { createCategoryAction, deleteCategoryAction, updateCategoryAction } from "./actions/categories";
import {
  createTransactionAction,
  deleteTransactionAction,
  updateTransactionAction,
} from "./actions/transactions";
import { createRecurringAction, deleteRecurringAction, updateRecurringAction } from "./actions/recurring";
import { createTransferAction, deleteTransferAction } from "./actions/transfers";
import { createBudgetAction, deleteBudgetAction, updateBudgetAction } from "./actions/budgets";
import {
  contributeToGoalAction,
  createGoalAction,
  deleteGoalAction,
  updateGoalAction,
} from "./actions/goals";
import { updateProfileAction } from "./actions/user";

function tempId(prefix: string) {
  return `temp-${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function reportError(err: unknown, fallback: string) {
  useToastStore.getState().show(err instanceof Error ? err.message : fallback, "danger");
}

interface FinanceState {
  accounts: Account[];
  categories: Category[];
  transactions: Transaction[];
  recurringTransactions: RecurringTransaction[];
  transfers: Transfer[];
  budgets: Budget[];
  goals: Goal[];
  user: UserProfile;

  addAccount: (account: Omit<Account, "id" | "createdAt">) => void;
  updateAccount: (id: string, account: Partial<Omit<Account, "id">>) => void;
  deleteAccount: (id: string) => void;

  addTransfer: (transfer: Omit<Transfer, "id">) => void;
  deleteTransfer: (id: string) => void;

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

function createFinanceStore(initial: UserFinanceData) {
  return createStore<FinanceState>()((set, get) => ({
    ...initial,

    addAccount: (account) => {
      const id = tempId("acc");
      const optimistic: Account = { ...account, id, createdAt: formatDateInput(new Date()) };
      set((state) => ({ accounts: [...state.accounts, optimistic] }));
      createAccountAction(account)
        .then((real) => set((state) => ({ accounts: state.accounts.map((a) => (a.id === id ? real : a)) })))
        .catch((err) => {
          set((state) => ({ accounts: state.accounts.filter((a) => a.id !== id) }));
          reportError(err, "Erro ao criar conta.");
        });
    },
    updateAccount: (id, account) => {
      const previous = get().accounts;
      set((state) => ({ accounts: state.accounts.map((a) => (a.id === id ? { ...a, ...account } : a)) }));
      updateAccountAction(id, account).catch((err) => {
        set({ accounts: previous });
        reportError(err, "Erro ao atualizar conta.");
      });
    },
    deleteAccount: (id) => {
      const previous = get();
      set((state) => ({
        accounts: state.accounts.filter((a) => a.id !== id),
        transactions: state.transactions.filter((t) => t.accountId !== id),
        recurringTransactions: state.recurringTransactions.filter((r) => r.accountId !== id),
        transfers: state.transfers.filter((t) => t.fromId !== id && t.toId !== id),
      }));
      deleteAccountAction(id).catch((err) => {
        set({
          accounts: previous.accounts,
          transactions: previous.transactions,
          recurringTransactions: previous.recurringTransactions,
          transfers: previous.transfers,
        });
        reportError(err, "Erro ao eliminar conta.");
      });
    },

    addTransfer: (transfer) => {
      const id = tempId("transfer");
      const optimistic: Transfer = { ...transfer, id };
      set((state) => ({ transfers: [optimistic, ...state.transfers] }));
      createTransferAction(transfer)
        .then((real) => set((state) => ({ transfers: state.transfers.map((t) => (t.id === id ? real : t)) })))
        .catch((err) => {
          set((state) => ({ transfers: state.transfers.filter((t) => t.id !== id) }));
          reportError(err, "Erro ao transferir entre contas.");
        });
    },
    deleteTransfer: (id) => {
      const previous = get().transfers;
      set((state) => ({ transfers: state.transfers.filter((t) => t.id !== id) }));
      deleteTransferAction(id).catch((err) => {
        set({ transfers: previous });
        reportError(err, "Erro ao eliminar transferência.");
      });
    },

    addCategory: (category) => {
      const id = tempId("cat");
      const optimistic: Category = { ...category, id };
      set((state) => ({ categories: [...state.categories, optimistic] }));
      createCategoryAction(category)
        .then((real) => set((state) => ({ categories: state.categories.map((c) => (c.id === id ? real : c)) })))
        .catch((err) => {
          set((state) => ({ categories: state.categories.filter((c) => c.id !== id) }));
          reportError(err, "Erro ao criar categoria.");
        });
    },
    updateCategory: (id, category) => {
      const previous = get().categories;
      set((state) => ({
        categories: state.categories.map((c) => (c.id === id ? { ...c, ...category } : c)),
      }));
      updateCategoryAction(id, category).catch((err) => {
        set({ categories: previous });
        reportError(err, "Erro ao atualizar categoria.");
      });
    },
    deleteCategory: (id) => {
      const previous = get();
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
        transactions: state.transactions.filter((t) => t.categoryId !== id),
        recurringTransactions: state.recurringTransactions.filter((r) => r.categoryId !== id),
        budgets: state.budgets.filter((b) => b.categoryId !== id),
      }));
      deleteCategoryAction(id).catch((err) => {
        set({
          categories: previous.categories,
          transactions: previous.transactions,
          recurringTransactions: previous.recurringTransactions,
          budgets: previous.budgets,
        });
        reportError(err, "Erro ao eliminar categoria.");
      });
    },

    addTransaction: (transaction) => {
      const id = tempId("tx");
      const optimistic: Transaction = { ...transaction, id };
      set((state) => ({ transactions: [optimistic, ...state.transactions] }));
      createTransactionAction(transaction)
        .then((real) =>
          set((state) => ({ transactions: state.transactions.map((t) => (t.id === id ? real : t)) }))
        )
        .catch((err) => {
          set((state) => ({ transactions: state.transactions.filter((t) => t.id !== id) }));
          reportError(err, "Erro ao criar transação.");
        });
    },
    updateTransaction: (id, transaction) => {
      const previous = get().transactions;
      set((state) => ({
        transactions: state.transactions.map((t) => (t.id === id ? { ...t, ...transaction } : t)),
      }));
      updateTransactionAction(id, transaction).catch((err) => {
        set({ transactions: previous });
        reportError(err, "Erro ao atualizar transação.");
      });
    },
    deleteTransaction: (id) => {
      const previous = get().transactions;
      set((state) => ({ transactions: state.transactions.filter((t) => t.id !== id) }));
      deleteTransactionAction(id).catch((err) => {
        set({ transactions: previous });
        reportError(err, "Erro ao eliminar transação.");
      });
    },

    addRecurring: (recurring) => {
      const id = tempId("rec");
      const optimistic: RecurringTransaction = { ...recurring, id };
      set((state) => ({ recurringTransactions: [...state.recurringTransactions, optimistic] }));
      createRecurringAction(recurring)
        .then((real) =>
          set((state) => ({
            recurringTransactions: state.recurringTransactions.map((r) => (r.id === id ? real : r)),
          }))
        )
        .catch((err) => {
          set((state) => ({
            recurringTransactions: state.recurringTransactions.filter((r) => r.id !== id),
          }));
          reportError(err, "Erro ao criar transação recorrente.");
        });
    },
    updateRecurring: (id, recurring) => {
      const previous = get().recurringTransactions;
      set((state) => ({
        recurringTransactions: state.recurringTransactions.map((r) =>
          r.id === id ? { ...r, ...recurring } : r
        ),
      }));
      updateRecurringAction(id, recurring).catch((err) => {
        set({ recurringTransactions: previous });
        reportError(err, "Erro ao atualizar transação recorrente.");
      });
    },
    deleteRecurring: (id) => {
      const previous = get().recurringTransactions;
      set((state) => ({
        recurringTransactions: state.recurringTransactions.filter((r) => r.id !== id),
      }));
      deleteRecurringAction(id).catch((err) => {
        set({ recurringTransactions: previous });
        reportError(err, "Erro ao eliminar transação recorrente.");
      });
    },

    addBudget: (budget) => {
      const id = tempId("bud");
      const optimistic: Budget = { ...budget, id };
      set((state) => ({ budgets: [...state.budgets, optimistic] }));
      createBudgetAction(budget)
        .then((real) => set((state) => ({ budgets: state.budgets.map((b) => (b.id === id ? real : b)) })))
        .catch((err) => {
          set((state) => ({ budgets: state.budgets.filter((b) => b.id !== id) }));
          reportError(err, "Erro ao criar orçamento.");
        });
    },
    updateBudget: (id, budget) => {
      const previous = get().budgets;
      set((state) => ({ budgets: state.budgets.map((b) => (b.id === id ? { ...b, ...budget } : b)) }));
      updateBudgetAction(id, budget).catch((err) => {
        set({ budgets: previous });
        reportError(err, "Erro ao atualizar orçamento.");
      });
    },
    deleteBudget: (id) => {
      const previous = get().budgets;
      set((state) => ({ budgets: state.budgets.filter((b) => b.id !== id) }));
      deleteBudgetAction(id).catch((err) => {
        set({ budgets: previous });
        reportError(err, "Erro ao eliminar orçamento.");
      });
    },

    addGoal: (goal) => {
      const id = tempId("goal");
      const optimistic: Goal = { ...goal, id, createdAt: formatDateInput(new Date()) };
      set((state) => ({ goals: [...state.goals, optimistic] }));
      createGoalAction(goal)
        .then((real) => set((state) => ({ goals: state.goals.map((g) => (g.id === id ? real : g)) })))
        .catch((err) => {
          set((state) => ({ goals: state.goals.filter((g) => g.id !== id) }));
          reportError(err, "Erro ao criar meta.");
        });
    },
    updateGoal: (id, goal) => {
      const previous = get().goals;
      set((state) => ({ goals: state.goals.map((g) => (g.id === id ? { ...g, ...goal } : g)) }));
      updateGoalAction(id, goal).catch((err) => {
        set({ goals: previous });
        reportError(err, "Erro ao atualizar meta.");
      });
    },
    deleteGoal: (id) => {
      const previous = get().goals;
      set((state) => ({ goals: state.goals.filter((g) => g.id !== id) }));
      deleteGoalAction(id).catch((err) => {
        set({ goals: previous });
        reportError(err, "Erro ao eliminar meta.");
      });
    },
    contributeToGoal: (id, amount) => {
      const previous = get().goals;
      set((state) => ({
        goals: state.goals.map((g) =>
          g.id === id ? { ...g, currentAmount: g.currentAmount + amount } : g
        ),
      }));
      contributeToGoalAction(id, amount)
        .then((real) => set((state) => ({ goals: state.goals.map((g) => (g.id === id ? real : g)) })))
        .catch((err) => {
          set({ goals: previous });
          reportError(err, "Erro ao adicionar fundos à meta.");
        });
    },

    updateUser: (user) => {
      const previous = get().user;
      set((state) => ({ user: { ...state.user, ...user } }));
      updateProfileAction(user).catch((err) => {
        set({ user: previous });
        reportError(err, "Erro ao atualizar perfil.");
      });
    },
  }));
}

type FinanceStoreApi = StoreApi<FinanceState>;

const FinanceStoreContext = createContext<FinanceStoreApi | null>(null);

export function FinanceStoreProvider({
  data,
  children,
}: {
  data: UserFinanceData;
  children: ReactNode;
}) {
  const [store] = useState<FinanceStoreApi>(() => createFinanceStore(data));
  return <FinanceStoreContext.Provider value={store}>{children}</FinanceStoreContext.Provider>;
}

export function useFinanceStore<T>(selector: (state: FinanceState) => T): T {
  const store = useContext(FinanceStoreContext);
  if (!store) throw new Error("useFinanceStore must be used within FinanceStoreProvider");
  return useStore(store, selector);
}
