"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCompactCurrency, formatCurrency } from "@/lib/format";
import type { MonthPoint } from "@/lib/calculations";

export function BalanceEvolutionChart({ data }: { data: MonthPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="0" />
        <XAxis
          dataKey="label"
          axisLine={false}
          tickLine={false}
          tickMargin={10}
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
          labelStyle={{ color: "var(--foreground)", fontWeight: 600, marginBottom: 4 }}
          formatter={(value) => [formatCurrency(Number(value)), "Saldo"]}
        />
        <Bar
          dataKey="balance"
          fill="var(--accent)"
          radius={[6, 6, 0, 0]}
          maxBarSize={40}
          animationDuration={700}
          animationEasing="ease-out"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
