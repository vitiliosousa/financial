// Cria (ou recria) uma conta demo com dados de exemplo.
// Uso: node prisma/seed-demo.mjs
// Login demo: demo@onazi.test / Demo#Onazi2026
import "dotenv/config";
import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import pg from "pg";

const EMAIL = "demo@onazi.test";
const PASSWORD = "Demo#Onazi2026";
const id = () => "c" + randomBytes(11).toString("hex");

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
const q = (text, params) => client.query(text, params);

const day = (offset) => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  return d;
};

try {
  await q("BEGIN");
  await q('DELETE FROM "User" WHERE email = $1', [EMAIL]);

  const userId = id();
  await q(
    'INSERT INTO "User" (id, name, email, "passwordHash", "avatarColor", "updatedAt") VALUES ($1,$2,$3,$4,$5,now())',
    [userId, "Conta Demo", EMAIL, await bcrypt.hash(PASSWORD, 10), "#6d5ef8"]
  );

  const accounts = {
    wallet: [id(), "Carteira", "wallet", "wallet", "#f59e0b", 38000],
    bank: [id(), "Millennium BIM", "bank", "landmark", "#3b82f6", 45000],
    mpesa: [id(), "M-Pesa", "mobile-money", "smartphone", "#ef4444", 6200],
    savings: [id(), "Poupança", "bank", "piggy-bank", "#22c55e", 20000],
  };
  for (const [aid, name, type, icon, color, bal] of Object.values(accounts)) {
    await q(
      'INSERT INTO "Account" (id,"userId",name,type,icon,color,"initialBalance") VALUES ($1,$2,$3,$4,$5,$6,$7)',
      [aid, userId, name, type, icon, color, bal]
    );
  }

  const cats = {};
  const catRows = [
    ["salario", "Salário", "income", "#22c55e", "briefcase"],
    ["freelance", "Freelance", "income", "#06b6d4", "coins"],
    ["alimentacao", "Alimentação", "expense", "#f97316", "utensils"],
    ["transporte", "Transporte", "expense", "#3b82f6", "car"],
    ["casa", "Casa", "expense", "#8b5cf6", "home"],
    ["lazer", "Lazer", "expense", "#ec4899", "gamepad-2"],
    ["saude", "Saúde", "expense", "#ef4444", "heart-pulse"],
    ["internet", "Internet e Telefone", "expense", "#14b8a6", "wifi"],
  ];
  for (const [key, name, type, color, icon] of catRows) {
    cats[key] = id();
    await q('INSERT INTO "Category" (id,"userId",name,type,color,icon) VALUES ($1,$2,$3,$4,$5,$6)', [
      cats[key], userId, name, type, color, icon,
    ]);
  }

  const tx = async (type, amount, cat, acc, offset, description, fee = 0) =>
    q(
      'INSERT INTO "Transaction" (id,"userId",type,amount,fee,"categoryId","accountId",date,description) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)',
      [id(), userId, type, amount, fee, cats[cat], accounts[acc][0], day(offset), description]
    );

  for (const m of [0, 1, 2, 3]) {
    const o = -m * 30;
    await tx("income", 38000, "salario", "bank", o - 2, "Salário mensal");
    await tx("expense", 12000, "casa", "bank", o - 1, "Renda");
    await tx("expense", 1800, "internet", "mpesa", o - 5, "Pacote de internet", 25);
    await tx("expense", 4200 + m * 300, "alimentacao", "wallet", o - 7, "Mercado");
    await tx("expense", 2600, "transporte", "mpesa", o - 10, "Combustível / chapa", 20);
    await tx("expense", 1500 + m * 200, "lazer", "wallet", o - 14, "Cinema e jantar");
  }
  await tx("income", 15000, "freelance", "mpesa", -9, "Projecto website", 150);
  await tx("expense", 2300, "saude", "wallet", -16, "Consulta e farmácia");
  await tx("expense", 900, "alimentacao", "wallet", -3, "Padaria e almoço");

  await q('INSERT INTO "Transfer" (id,"userId","fromId","toId",amount,fee,date,description) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)', [
    id(), userId, accounts.bank[0], accounts.savings[0], 8000, 0, day(-4), "Poupança do mês",
  ]);

  const month = new Date().getMonth();
  const year = new Date().getFullYear();
  for (const [cat, limit] of [["alimentacao", 8000], ["transporte", 3500], ["lazer", 3000], ["internet", 2000]]) {
    await q('INSERT INTO "Budget" (id,"userId","categoryId","limit",month,year) VALUES ($1,$2,$3,$4,$5,$6)', [
      id(), userId, cats[cat], limit, month, year,
    ]);
  }

  for (const [name, icon, color, target, current, deadlineOffset] of [
    ["Fundo de Emergência", "piggy-bank", "#22c55e", 100000, 28000, 240],
    ["Viagem a Zanzibar", "plane", "#06b6d4", 40000, 12500, 180],
  ]) {
    await q('INSERT INTO "Goal" (id,"userId",name,icon,color,"targetAmount","currentAmount",deadline) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)', [
      id(), userId, name, icon, color, target, current, day(deadlineOffset),
    ]);
  }

  const loanId1 = id();
  const loanId2 = id();
  const loan = (lid, acc, direction, who, principal, rate, offset, due, note) =>
    q(
      'INSERT INTO "Loan" (id,"userId","accountId",direction,counterparty,principal,"interestRate",date,"dueDate",description) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
      [lid, userId, accounts[acc][0], direction, who, principal, rate, day(offset), due === null ? null : day(due), note]
    );
  await loan(loanId1, "bank", "borrowed", "Banco BCI", 30000, 12, -60, 120, "Crédito pessoal");
  await loan(loanId2, "wallet", "lent", "Carlos", 5000, 0, -20, -5, "Emprestei para a renda");
  const pay = (lid, acc, amount, offset) =>
    q('INSERT INTO "LoanPayment" (id,"loanId","accountId",amount,date) VALUES ($1,$2,$3,$4,$5)', [
      id(), lid, accounts[acc][0], amount, day(offset),
    ]);
  await pay(loanId1, "bank", 5600, -30);
  await pay(loanId1, "bank", 5600, 0);
  await pay(loanId2, "wallet", 2000, -10);

  await q("COMMIT");
  console.log(`Conta demo criada: ${EMAIL}`);
} catch (e) {
  await q("ROLLBACK");
  throw e;
} finally {
  await client.end();
}
