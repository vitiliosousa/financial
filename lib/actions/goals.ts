"use server";

import { prisma } from "@/lib/db";
import { parseLocalDate } from "@/lib/date";
import { goalInputSchema } from "@/lib/validation";
import { serializeGoal } from "@/lib/serialize";
import { requireUserId } from "./utils";
import type { Goal } from "@/lib/types";

export async function createGoalAction(input: Omit<Goal, "id" | "createdAt">): Promise<Goal> {
  const userId = await requireUserId();
  const data = goalInputSchema.parse(input);
  const row = await prisma.goal.create({
    data: { ...data, deadline: data.deadline ? parseLocalDate(data.deadline) : undefined, userId },
  });
  return serializeGoal(row);
}

export async function updateGoalAction(
  id: string,
  input: Partial<Omit<Goal, "id">>
): Promise<Goal> {
  const userId = await requireUserId();
  const data = goalInputSchema.partial().parse(input);
  const row = await prisma.goal.update({
    where: { id, userId },
    data: { ...data, deadline: data.deadline ? parseLocalDate(data.deadline) : undefined },
  });
  return serializeGoal(row);
}

export async function deleteGoalAction(id: string): Promise<void> {
  const userId = await requireUserId();
  await prisma.goal.delete({ where: { id, userId } });
}

export async function contributeToGoalAction(id: string, amount: number): Promise<Goal> {
  const userId = await requireUserId();
  const row = await prisma.goal.update({
    where: { id, userId },
    data: { currentAmount: { increment: amount } },
  });
  return serializeGoal(row);
}
