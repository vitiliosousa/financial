"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { registerInputSchema } from "@/lib/validation";
import { CATEGORIES } from "@/lib/mock-data";

const DEFAULT_CATEGORIES = CATEGORIES.map((category) => ({
  name: category.name,
  type: category.type,
  color: category.color,
  icon: category.icon,
}));

export async function registerAction(input: {
  name: string;
  email: string;
  password: string;
}): Promise<void> {
  const data = registerInputSchema.parse(input);

  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw new Error("Este e-mail já está registado.");

  const passwordHash = await bcrypt.hash(data.password, 12);

  await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash,
      accounts: {
        create: [{ name: "Carteira", type: "wallet", icon: "wallet", color: "#6d5ef8", initialBalance: 0 }],
      },
      categories: { create: DEFAULT_CATEGORIES },
    },
  });
}
