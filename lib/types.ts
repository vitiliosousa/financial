export type TransactionType = "income" | "expense";

export type RecurrenceFrequency = "daily" | "weekly" | "monthly" | "yearly";

export type IconName =
  | "wallet"
  | "landmark"
  | "smartphone"
  | "credit-card"
  | "piggy-bank"
  | "utensils"
  | "car"
  | "wifi"
  | "briefcase"
  | "gamepad-2"
  | "home"
  | "heart-pulse"
  | "graduation-cap"
  | "shirt"
  | "plane"
  | "gift"
  | "shopping-cart"
  | "receipt"
  | "trending-up"
  | "coins"
  | "target"
  | "plus-circle"
  | "sparkles"
  | "dumbbell"
  | "dog";

export interface Account {
  id: string;
  name: string;
  type: "wallet" | "bank" | "mobile-money" | "other";
  icon: IconName;
  color: string;
  initialBalance: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
  icon: IconName;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  accountId: string;
  date: string; // ISO date string
  description?: string;
  recurringId?: string;
}

export interface RecurringTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  accountId: string;
  description?: string;
  frequency: RecurrenceFrequency;
  startDate: string;
  endDate?: string;
  active: boolean;
  lastGeneratedDate?: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  limit: number;
  month: number; // 0-11
  year: number;
}

export interface Goal {
  id: string;
  name: string;
  icon: IconName;
  color: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  createdAt: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarColor: string;
}
