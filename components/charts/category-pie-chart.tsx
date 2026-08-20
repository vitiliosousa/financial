"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatCurrency } from "@/lib/format";
import type { CategoryBreakdownItem } from "@/lib/calculations";
import { DynamicIcon } from "@/components/ui/icon";

export function CategoryPieChart({ items }: { items: CategoryBreakdownItem[] }) {
  if (items.length === 0) {
    return (
      <div className="flex h-[240px] items-center justify-center text-sm text-muted-foreground">
        Sem dados para este período.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-4">
      <div className="w-full shrink-0 sm:w-[150px]">
        <ResponsiveContainer width="100%" height={150}>
          <PieChart>
            <Pie
              data={items}
              dataKey="total"
              nameKey="category.name"
              innerRadius={46}
              outerRadius={68}
              paddingAngle={2}
              stroke="none"
            >
              {items.map((item) => (
                <Cell key={item.category.id} fill={item.category.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              }}
              formatter={(value, _name, item) => [
                formatCurrency(Number(value)),
                item.payload.category.name,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="w-full min-w-0 flex-1 space-y-2.5">
        {items.slice(0, 6).map((item) => (
          <div key={item.category.id} className="flex items-center gap-2.5 text-sm">
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
              style={{ background: `${item.category.color}1f`, color: item.category.color }}
            >
              <DynamicIcon name={item.category.icon} size={12} />
            </span>
            <span className="min-w-0 flex-1 truncate text-foreground">{item.category.name}</span>
            <span className="shrink-0 text-xs text-muted-foreground">
              {item.percentage.toFixed(0)}%
            </span>
            <span className="shrink-0 text-right font-medium text-foreground">
              {formatCurrency(item.total)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
