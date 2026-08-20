"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCompactCurrency, formatCurrency } from "@/lib/format";
import type { MonthPoint } from "@/lib/calculations";

export function BalanceEvolutionChart({ data }: { data: MonthPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
          </linearGradient>
        </defs>
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
          cursor={{ stroke: "var(--accent)", strokeWidth: 1, strokeDasharray: "4 4" }}
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
        <Area
          type="monotone"
          dataKey="balance"
          stroke="var(--accent)"
          strokeWidth={2.5}
          fill="url(#balanceGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
