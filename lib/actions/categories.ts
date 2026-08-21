"use server";

import { prisma } from "@/lib/db";
import { categoryInputSchema } from "@/lib/validation";
import { serializeCategory } from "@/lib/serialize";
import { requireUserId } from "./utils";
import type { Category } from "@/lib/types";

export async function createCategoryAction(input: Omit<Category, "id">): Promise<Category> {
  const userId = await requireUserId();
  const data = categoryInputSchema.parse(input);
  const row = await prisma.category.create({ data: { ...data, userId } });
  return serializeCategory(row);
}

export async function updateCategoryAction(
  id: string,
  input: Partial<Omit<Category, "id">>
): Promise<Category> {
  const userId = await requireUserId();
  const data = categoryInputSchema.partial().parse(input);
  const row = await prisma.category.update({ where: { id, userId }, data });
  return serializeCategory(row);
}

export async function deleteCategoryAction(id: string): Promise<void> {
  const userId = await requireUserId();
  await prisma.category.delete({ where: { id, userId } });
}
