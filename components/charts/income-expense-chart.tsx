"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCompactCurrency, formatCurrency } from "@/lib/format";
import type { MonthPoint } from "@/lib/calculations";

export function IncomeExpenseChart({ data }: { data: MonthPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis
          dataKey="label"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          width={56}
          tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
          tickFormatter={(v) => formatCompactCurrency(v)}
        />
        <Tooltip
          cursor={{ fill: "var(--surface-hover)" }}
          contentStyle={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            fontSize: 12,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          }}
          formatter={(value, name) => [
            formatCurrency(Number(value)),
            name === "income" ? "Receitas" : "Despesas",
          ]}
        />
        <Legend
          formatter={(value) => (value === "income" ? "Receitas" : "Despesas")}
          wrapperStyle={{ fontSize: 12, color: "var(--muted-foreground)" }}
        />
        <Bar dataKey="income" fill="var(--success)" radius={[6, 6, 0, 0]} maxBarSize={28} />
        <Bar dataKey="expense" fill="var(--danger)" radius={[6, 6, 0, 0]} maxBarSize={28} />
      </BarChart>
    </ResponsiveContainer>
  );
}
