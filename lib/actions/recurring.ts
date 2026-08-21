"use server";

import { prisma } from "@/lib/db";
import { parseLocalDate } from "@/lib/date";
import { recurringInputSchema } from "@/lib/validation";
import { serializeRecurring } from "@/lib/serialize";
import { requireUserId } from "./utils";
import type { RecurringTransaction } from "@/lib/types";

export async function createRecurringAction(
  input: Omit<RecurringTransaction, "id">
): Promise<RecurringTransaction> {
  const userId = await requireUserId();
  const data = recurringInputSchema.parse(input);
  const row = await prisma.recurringTransaction.create({
    data: {
      ...data,
      startDate: parseLocalDate(data.startDate),
      endDate: data.endDate ? parseLocalDate(data.endDate) : undefined,
      lastGeneratedDate: data.lastGeneratedDate ? parseLocalDate(data.lastGeneratedDate) : undefined,
      userId,
    },
  });
  return serializeRecurring(row);
}

export async function updateRecurringAction(
  id: string,
  input: Partial<Omit<RecurringTransaction, "id">>
): Promise<RecurringTransaction> {
  const userId = await requireUserId();
  const data = recurringInputSchema.partial().parse(input);
  const row = await prisma.recurringTransaction.update({
    where: { id, userId },
    data: {
      ...data,
      startDate: data.startDate ? parseLocalDate(data.startDate) : undefined,
      endDate: data.endDate ? parseLocalDate(data.endDate) : undefined,
      lastGeneratedDate: data.lastGeneratedDate ? parseLocalDate(data.lastGeneratedDate) : undefined,
    },
  });
  return serializeRecurring(row);
}

export async function deleteRecurringAction(id: string): Promise<void> {
  const userId = await requireUserId();
  await prisma.recurringTransaction.delete({ where: { id, userId } });
}
