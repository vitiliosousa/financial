"use server";

import { prisma } from "@/lib/db";
import { parseLocalDate } from "@/lib/date";
import { transactionInputSchema } from "@/lib/validation";
import { serializeTransaction } from "@/lib/serialize";
import { requireUserId } from "./utils";
import type { Transaction } from "@/lib/types";

export async function createTransactionAction(input: Omit<Transaction, "id">): Promise<Transaction> {
  const userId = await requireUserId();
  const data = transactionInputSchema.parse(input);
  const row = await prisma.transaction.create({
    data: { ...data, date: parseLocalDate(data.date), userId },
  });
  return serializeTransaction(row);
}

export async function updateTransactionAction(
  id: string,
  input: Partial<Omit<Transaction, "id">>
): Promise<Transaction> {
  const userId = await requireUserId();
  const data = transactionInputSchema.partial().parse(input);
  const row = await prisma.transaction.update({
    where: { id, userId },
    data: { ...data, date: data.date ? parseLocalDate(data.date) : undefined },
  });
  return serializeTransaction(row);
}

export async function deleteTransactionAction(id: string): Promise<void> {
  const userId = await requireUserId();
  await prisma.transaction.delete({ where: { id, userId } });
}
