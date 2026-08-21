"use client";

import Link from "next/link";
import { useFinanceStore } from "@/lib/store";
import {
  getBalanceEvolution,
  getBudgetUsage,
  getCategoryBreakdown,
  getGoalProgress,
  getMonthSummary,
  getTotalBalance,
  getTransactionsForMonth,
} from "@/lib/calculations";
import { formatCurrency, formatFullMonthLabel } from "@/lib/format";
import { StatCard } from "@/components/dashboard/stat-card";
import { HeroBalanceCard } from "@/components/dashboard/hero-balance-card";
import { QuickLinks } from "@/components/dashboard/quick-links";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BalanceEvolutionChart } from "@/components/charts/balance-evolution-chart";
import { CategoryPieChart } from "@/components/charts/category-pie-chart";
import { TransactionRow } from "@/components/transactions/transaction-row";
import { ProgressBar } from "@/components/ui/progress-bar";
import { IconBadge } from "@/components/ui/icon-badge";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { MaterialIcon } from "@/components/ui/material-icon";

export default function DashboardPage() {
  const { accounts, categories, transactions, transfers, budgets, goals } = useFinanceStore((s) => s);

  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  const monthTransactions = getTransactionsForMonth(transactions, month, year);
  const summary = getMonthSummary(monthTransactions);
  const totalBalance = getTotalBalance(accounts, transactions, transfers);
  const evolution = getBalanceEvolution(accounts, transactions, 6);
  const categoryBreakdown = getCategoryBreakdown(monthTransactions, categories, "expense");

  const recentTransactions = [...transactions]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 6);

  const budgetUsage = getBudgetUsage(budgets, categories, transactions)
    .filter((b) => b.percentage >= 80)
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 4);

  const activeGoals = goals
    .map((g) => getGoalProgress(g))
    .filter((g) => !g.isCompleted)
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">
          Resumo de {formatFullMonthLabel(month, year)} &middot; vamos poupar mais este mês.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 lg:h-full">
          <HeroBalanceCard
            totalBalance={totalBalance}
            income={summary.income}
            expense={summary.expense}
            accountsCount={accounts.length}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:h-full lg:grid-cols-1 lg:grid-rows-2">
          <StatCard
            label="Valor poupado este mês"
            value={formatCurrency(summary.saved)}
            icon="savings"
            tone="success"
            trend={{ value: summary.savingsRate, label: "taxa de poupança" }}
          />
          <StatCard
            label="Categorias com despesas"
            value={String(categoryBreakdown.length)}
            icon="sell"
            tone="info"
            footer={
              categoryBreakdown[0]
                ? `${categoryBreakdown[0].category.name} lidera com ${categoryBreakdown[0].percentage.toFixed(0)}%`
                : "Sem despesas este mês"
            }
          />
        </div>
      </div>

      <QuickLinks />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Evolução do saldo</CardTitle>
              <CardDescription>Últimos 6 meses</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <BalanceEvolutionChart data={evolution} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Despesas por categoria</CardTitle>
              <CardDescription>Este mês</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <CategoryPieChart items={categoryBreakdown} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Orçamentos próximos do limite</CardTitle>
              <CardDescription>≥ 80% utilizado</CardDescription>
            </div>
            <Link href="/budgets" className="text-xs font-medium text-accent hover:underline">
              Ver todos
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {budgetUsage.length === 0 ? (
              <EmptyState
                icon="task_alt"
                title="Tudo sob controlo"
                description="Nenhum orçamento está próximo do limite este mês."
              />
            ) : (
              budgetUsage.map((b) => (
                <div key={b.budget.id}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IconBadge icon={b.category.icon} color={b.category.color} size="sm" />
                      <span className="text-sm font-medium text-foreground">{b.category.name}</span>
                    </div>
                    <Badge tone={b.status === "exceeded" ? "danger" : b.status === "danger" ? "warning" : "warning"}>
                      {b.percentage.toFixed(0)}%
                    </Badge>
                  </div>
                  <ProgressBar
                    value={b.percentage}
                    color={b.status === "exceeded" ? "var(--danger)" : "var(--warning)"}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatCurrency(b.spent)} de {formatCurrency(b.budget.limit)}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <div>
              <CardTitle>Últimas transações</CardTitle>
              <CardDescription>Movimentos mais recentes</CardDescription>
            </div>
            <Link href="/transactions" className="flex items-center gap-1 text-xs font-medium text-accent hover:underline">
              Ver todas <MaterialIcon name="arrow_forward" size={14} />
            </Link>
          </CardHeader>
          <CardContent className="space-y-0.5">
            {recentTransactions.map((t) => (
              <TransactionRow
                key={t.id}
                transaction={t}
                category={categories.find((c) => c.id === t.categoryId)}
                account={accounts.find((a) => a.id === t.accountId)}
              />
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Metas financeiras em progresso</CardTitle>
            <CardDescription>Continue a poupar para alcançar os seus objetivos</CardDescription>
          </div>
          <Link href="/goals" className="flex items-center gap-1 text-xs font-medium text-accent hover:underline">
            Ver todas <MaterialIcon name="arrow_forward" size={14} />
          </Link>
        </CardHeader>
        <CardContent>
          {activeGoals.length === 0 ? (
            <EmptyState
              icon="savings"
              title="Sem metas em progresso"
              description="Crie uma meta financeira para começar a poupar com objetivo."
              action={
                <Link href="/goals">
                  <Button size="sm">Criar meta</Button>
                </Link>
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {activeGoals.map((g) => (
                <div key={g.goal.id} className="rounded-[var(--radius-md)] border border-border p-4">
                  <div className="mb-3 flex items-center gap-2.5">
                    <IconBadge icon={g.goal.icon} color={g.goal.color} size="sm" />
                    <span className="truncate text-sm font-medium text-foreground">{g.goal.name}</span>
                  </div>
                  <ProgressBar value={g.percentage} color={g.goal.color} />
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{formatCurrency(g.goal.currentAmount)}</span>
                    <span className="font-medium text-foreground">{g.percentage.toFixed(0)}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
