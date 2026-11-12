"use server";

import { prisma } from "@/lib/db";
import { parseLocalDate } from "@/lib/date";
import { loanInputSchema, loanPaymentInputSchema } from "@/lib/validation";
import { serializeLoan, serializeLoanPayment } from "@/lib/serialize";
import { requireUserId } from "./utils";
import type { Loan, LoanPayment } from "@/lib/types";

type LoanInput = Omit<Loan, "id" | "payments">;

export async function createLoanAction(input: LoanInput): Promise<Loan> {
  const userId = await requireUserId();
  const data = loanInputSchema.parse(input);
  await prisma.account.findUniqueOrThrow({ where: { id: data.accountId, userId } });
  const row = await prisma.loan.create({
    data: {
      ...data,
      date: parseLocalDate(data.date),
      dueDate: data.dueDate ? parseLocalDate(data.dueDate) : undefined,
      userId,
    },
    include: { payments: true },
  });
  return serializeLoan(row);
}

export async function updateLoanAction(id: string, input: LoanInput): Promise<Loan> {
  const userId = await requireUserId();
  const data = loanInputSchema.parse(input);
  await prisma.account.findUniqueOrThrow({ where: { id: data.accountId, userId } });
  const row = await prisma.loan.update({
    where: { id, userId },
    data: {
      ...data,
      date: parseLocalDate(data.date),
      dueDate: data.dueDate ? parseLocalDate(data.dueDate) : null,
    },
    include: { payments: true },
  });
  return serializeLoan(row);
}

export async function deleteLoanAction(id: string): Promise<void> {
  const userId = await requireUserId();
  await prisma.loan.delete({ where: { id, userId } });
}

export async function addLoanPaymentAction(
  loanId: string,
  input: Omit<LoanPayment, "id" | "loanId">
): Promise<LoanPayment> {
  const userId = await requireUserId();
  const data = loanPaymentInputSchema.parse(input);
  // Ownership: both the loan and the account must belong to the caller.
  await Promise.all([
    prisma.loan.findUniqueOrThrow({ where: { id: loanId, userId } }),
    prisma.account.findUniqueOrThrow({ where: { id: data.accountId, userId } }),
  ]);
  const row = await prisma.loanPayment.create({
    data: { ...data, loanId, date: parseLocalDate(data.date) },
  });
  return serializeLoanPayment(row);
}

export async function deleteLoanPaymentAction(id: string): Promise<void> {
  const userId = await requireUserId();
  await prisma.loanPayment.delete({ where: { id, loan: { userId } } });
}
