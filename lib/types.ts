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
  | "dog"
  | "more-horizontal";

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
  fee: number; // taxa/comissão cobrada pela operação (ex: comissão M-Pesa)
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

export interface Transfer {
  id: string;
  fromId: string;
  toId: string;
  amount: number;
  fee: number;
  date: string; // ISO date string
  description?: string;
}

export type LoanDirection = "borrowed" | "lent";

export interface LoanPayment {
  id: string;
  loanId: string;
  accountId: string;
  amount: number;
  date: string;
}

export interface Loan {
  id: string;
  direction: LoanDirection; // borrowed = devo | lent = devem-me
  counterparty: string;
  principal: number;
  interestRate: number; // juro simples total, em %
  accountId: string; // conta onde o dinheiro entrou/saiu
  date: string;
  dueDate?: string;
  description?: string;
  payments: LoanPayment[];
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
