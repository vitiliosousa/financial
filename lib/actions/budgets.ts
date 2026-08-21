"use server";

import { prisma } from "@/lib/db";
import { budgetInputSchema } from "@/lib/validation";
import { serializeBudget } from "@/lib/serialize";
import { requireUserId } from "./utils";
import type { Budget } from "@/lib/types";

export async function createBudgetAction(input: Omit<Budget, "id">): Promise<Budget> {
  const userId = await requireUserId();
  const data = budgetInputSchema.parse(input);
  const row = await prisma.budget.create({ data: { ...data, userId } });
  return serializeBudget(row);
}

export async function updateBudgetAction(
  id: string,
  input: Partial<Omit<Budget, "id">>
): Promise<Budget> {
  const userId = await requireUserId();
  const data = budgetInputSchema.partial().parse(input);
  const row = await prisma.budget.update({ where: { id, userId }, data });
  return serializeBudget(row);
}

export async function deleteBudgetAction(id: string): Promise<void> {
  const userId = await requireUserId();
  await prisma.budget.delete({ where: { id, userId } });
}
