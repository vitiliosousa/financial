"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { profileInputSchema, passwordInputSchema } from "@/lib/validation";
import { requireUserId } from "./utils";
import type { UserProfile } from "@/lib/types";

export async function updateProfileAction(
  input: Partial<UserProfile>
): Promise<UserProfile> {
  const userId = await requireUserId();
  const { name, avatarColor } = profileInputSchema.partial().parse(input);
  const email = input.email?.trim().toLowerCase();

  const row = await prisma.user.update({
    where: { id: userId },
    data: { name, avatarColor, email },
  });

  return { name: row.name, email: row.email, avatarColor: row.avatarColor };
}

export async function changePasswordAction(input: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> {
  const userId = await requireUserId();
  const { currentPassword, newPassword } = passwordInputSchema.parse(input);

  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) throw new Error("Palavra-passe atual incorreta.");

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });
}
