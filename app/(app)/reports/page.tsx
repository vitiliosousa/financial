"use client";

import { useState } from "react";
import { useFinanceStore } from "@/lib/store";
import {
  getBalanceEvolution,
  getCategoryBreakdown,
  getMonthSummary,
} from "@/lib/calculations";
import { parseLocalDate } from "@/lib/date";
import { formatCurrency, formatPercent } from "@/lib/format";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { StatCard } from "@/components/dashboard/stat-card";
import { BalanceEvolutionChart } from "@/components/charts/balance-evolution-chart";
import { IncomeExpenseChart } from "@/components/charts/income-expense-chart";
import { CategoryPieChart } from "@/components/charts/category-pie-chart";
import { IconBadge } from "@/components/ui/icon-badge";
import { ProgressBar } from "@/components/ui/progress-bar";

type Period = "this-month" | "last-3" | "last-6" | "this-year" | "custom";

function getRangeAndMonths(period: Period, custom: { start: string; end: string }): { range: [Date, Date]; monthsBack: number } {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
  switch (period) {
    case "this-month":
      return { range: [new Date(now.getFullYear(), now.getMonth(), 1), today], monthsBack: 1 };
    case "last-3":
      return { range: [new Date(now.getFullYear(), now.getMonth() - 2, 1), today], monthsBack: 3 };
    case "last-6":
      return { range: [new Date(now.getFullYear(), now.getMonth() - 5, 1), today], monthsBack: 6 };
    case "this-year":
      return { range: [new Date(now.getFullYear(), 0, 1), today], monthsBack: now.getMonth() + 1 };
    case "custom": {
      if (!custom.start || !custom.end) return { range: [today, today], monthsBack: 1 };
      const start = parseLocalDate(custom.start);
      const end = parseLocalDate(custom.end);
      end.setHours(23, 59, 59);
      const monthsBack = Math.max(
        1,
        (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1
      );
      return { range: [start, end], monthsBack };
    }
  }
}

export default function ReportsPage() {
  const { accounts, categories, transactions } = useFinanceStore((s) => s);
  const [period, setPeriod] = useState<Period>("last-6");
  const [customRange, setCustomRange] = useState({ start: "", end: "" });

  const { range, monthsBack } = getRangeAndMonths(period, customRange);

  const periodTransactions = transactions.filter((t) => {
    const d = parseLocalDate(t.date);
    return d >= range[0] && d <= range[1];
  });

  const summary = getMonthSummary(periodTransactions);
  const evolution = getBalanceEvolution(accounts, transactions, monthsBack);
  const expenseBreakdown = getCategoryBreakdown(periodTransactions, categories, "expense");
  const incomeBreakdown = getCategoryBreakdown(periodTransactions, categories, "income");
  const topCategories = expenseBreakdown.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Período:</span>
        <Select className="w-auto" value={period} onChange={(e) => setPeriod(e.target.value as Period)}>
          <option value="this-month">Este mês</option>
          <option value="last-3">Últimos 3 meses</option>
          <option value="last-6">Últimos 6 meses</option>
          <option value="this-year">Este ano</option>
          <option value="custom">Intervalo personalizado</option>
        </Select>
        {period === "custom" && (
          <>
            <Input
              type="date"
              className="w-auto"
              value={customRange.start}
              onChange={(e) => setCustomRange((r) => ({ ...r, start: e.target.value }))}
            />
            <span className="text-sm text-muted-foreground">até</span>
            <Input
              type="date"
              className="w-auto"
              value={customRange.end}
              onChange={(e) => setCustomRange((r) => ({ ...r, end: e.target.value }))}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Receitas totais" value={formatCurrency(summary.income)} icon="trending_up" tone="success" />
        <StatCard label="Despesas totais" value={formatCurrency(summary.expense)} icon="trending_down" tone="danger" />
        <StatCard label="Fluxo de caixa" value={formatCurrency(summary.saved)} icon="account_balance_wallet" tone="primary" />
        <StatCard
          label="Taxa de poupança"
          value={formatPercent(summary.savingsRate)}
          icon="savings"
          tone="info"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Evolução mensal do saldo</CardTitle>
              <CardDescription>Fluxo de caixa acumulado</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <BalanceEvolutionChart data={evolution} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Receitas vs. despesas</CardTitle>
              <CardDescription>Comparação mensal</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <IncomeExpenseChart data={evolution} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Despesas por categoria</CardTitle>
              <CardDescription>Distribuição do período selecionado</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <CategoryPieChart items={expenseBreakdown} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Receitas por categoria</CardTitle>
              <CardDescription>Distribuição do período selecionado</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <CategoryPieChart items={incomeBreakdown} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Categorias que mais consomem dinheiro</CardTitle>
            <CardDescription>Top 5 despesas do período</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {topCategories.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sem despesas registadas neste período.</p>
          ) : (
            topCategories.map((item, idx) => (
              <div key={item.category.id} className="flex items-center gap-3">
                <span className="w-5 text-sm font-medium text-muted-foreground">{idx + 1}</span>
                <IconBadge icon={item.category.icon} color={item.category.color} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{item.category.name}</span>
                    <span className="text-muted-foreground">{formatCurrency(item.total)}</span>
                  </div>
                  <div className="mt-1.5">
                    <ProgressBar value={item.percentage} color={item.category.color} height={6} />
                  </div>
                </div>
                <span className="w-10 shrink-0 text-right text-xs text-muted-foreground">
                  {item.percentage.toFixed(0)}%
                </span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
