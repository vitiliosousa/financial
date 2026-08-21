import { z } from "zod";

export const accountTypeSchema = z.enum(["wallet", "bank", "mobile-money", "other"]);
export const transactionTypeSchema = z.enum(["income", "expense"]);
export const frequencySchema = z.enum(["daily", "weekly", "monthly", "yearly"]);

// "YYYY-MM-DD" date-only string, matching the app's date convention (lib/date.ts).
const dateOnlySchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida");

export const accountInputSchema = z.object({
  name: z.string().trim().min(1).max(60),
  type: accountTypeSchema,
  icon: z.string().min(1),
  color: z.string().min(1),
  initialBalance: z.number().finite(),
});

export const categoryInputSchema = z.object({
  name: z.string().trim().min(1).max(60),
  type: transactionTypeSchema,
  color: z.string().min(1),
  icon: z.string().min(1),
});

export const transactionInputSchema = z.object({
  type: transactionTypeSchema,
  amount: z.number().positive(),
  categoryId: z.string().min(1),
  accountId: z.string().min(1),
  date: dateOnlySchema,
  description: z.string().trim().max(200).optional(),
  recurringId: z.string().optional(),
});

export const recurringInputSchema = z.object({
  type: transactionTypeSchema,
  amount: z.number().positive(),
  categoryId: z.string().min(1),
  accountId: z.string().min(1),
  description: z.string().trim().max(200).optional(),
  frequency: frequencySchema,
  startDate: dateOnlySchema,
  endDate: dateOnlySchema.optional(),
  active: z.boolean(),
  lastGeneratedDate: dateOnlySchema.optional(),
});

export const transferInputSchema = z
  .object({
    fromId: z.string().min(1),
    toId: z.string().min(1),
    amount: z.number().positive(),
    date: dateOnlySchema,
    description: z.string().trim().max(200).optional(),
  })
  .refine((data) => data.fromId !== data.toId, {
    message: "A conta de origem e destino devem ser diferentes.",
    path: ["toId"],
  });

export const budgetInputSchema = z.object({
  categoryId: z.string().min(1),
  limit: z.number().positive(),
  month: z.number().int().min(0).max(11),
  year: z.number().int().min(2000).max(2100),
});

export const goalInputSchema = z.object({
  name: z.string().trim().min(1).max(60),
  icon: z.string().min(1),
  color: z.string().min(1),
  targetAmount: z.number().positive(),
  currentAmount: z.number().min(0),
  deadline: dateOnlySchema.optional(),
});

export const profileInputSchema = z.object({
  name: z.string().trim().min(1).max(80),
  avatarColor: z.string().min(1),
});

export const passwordInputSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8, "A palavra-passe deve ter pelo menos 8 caracteres"),
  })
  .strict();

export const registerInputSchema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8, "A palavra-passe deve ter pelo menos 8 caracteres"),
});
