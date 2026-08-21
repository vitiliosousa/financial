"use server";

import { prisma } from "@/lib/db";
import { accountInputSchema } from "@/lib/validation";
import { serializeAccount } from "@/lib/serialize";
import { requireUserId } from "./utils";
import type { Account } from "@/lib/types";

export async function createAccountAction(input: Omit<Account, "id" | "createdAt">): Promise<Account> {
  const userId = await requireUserId();
  const data = accountInputSchema.parse(input);
  const row = await prisma.account.create({ data: { ...data, userId } });
  return serializeAccount(row);
}

export async function updateAccountAction(
  id: string,
  input: Partial<Omit<Account, "id">>
): Promise<Account> {
  const userId = await requireUserId();
  const data = accountInputSchema.partial().parse(input);
  const row = await prisma.account.update({
    where: { id, userId },
    data,
  });
  return serializeAccount(row);
}

export async function deleteAccountAction(id: string): Promise<void> {
  const userId = await requireUserId();
  await prisma.account.delete({ where: { id, userId } });
}
