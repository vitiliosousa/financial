"use server";

import { prisma } from "@/lib/db";
import { parseLocalDate } from "@/lib/date";
import { transferInputSchema } from "@/lib/validation";
import { serializeTransfer } from "@/lib/serialize";
import { requireUserId } from "./utils";
import type { Transfer } from "@/lib/types";

export async function createTransferAction(input: Omit<Transfer, "id">): Promise<Transfer> {
  const userId = await requireUserId();
  const data = transferInputSchema.parse(input);

  // Ownership check: both accounts must belong to the caller, not just the transfer row itself.
  await Promise.all([
    prisma.account.findUniqueOrThrow({ where: { id: data.fromId, userId } }),
    prisma.account.findUniqueOrThrow({ where: { id: data.toId, userId } }),
  ]);

  const row = await prisma.transfer.create({
    data: { ...data, date: parseLocalDate(data.date), userId },
  });
  return serializeTransfer(row);
}

export async function deleteTransferAction(id: string): Promise<void> {
  const userId = await requireUserId();
  await prisma.transfer.delete({ where: { id, userId } });
}
