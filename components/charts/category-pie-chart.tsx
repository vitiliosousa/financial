"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatCurrency } from "@/lib/format";
import type { CategoryBreakdownItem } from "@/lib/calculations";
import type { IconName } from "@/lib/types";
import { DynamicIcon } from "@/components/ui/icon";

const MAX_SLICES = 5;
const OTHERS_COLOR = "#94a3b8";

interface Slice {
  key: string;
  name: string;
  icon: IconName;
  color: string;
  total: number;
  percentage: number;
}

export function CategoryPieChart({ items }: { items: CategoryBreakdownItem[] }) {
  if (items.length === 0) {
    return (
      <div className="flex h-[240px] items-center justify-center text-sm text-muted-foreground">
        Sem dados para este período.
      </div>
    );
  }

  // Cap individually-labeled slices so every wedge in the donut has a matching
  // legend row — beyond that, extra categories collapse into a single "Outras".
  const slices: Slice[] =
    items.length > MAX_SLICES
      ? [
          ...items.slice(0, MAX_SLICES).map((item) => ({
            key: item.category.id,
            name: item.category.name,
            icon: item.category.icon,
            color: item.category.color,
            total: item.total,
            percentage: item.percentage,
          })),
          {
            key: "others",
            name: "Outras",
            icon: "more-horizontal",
            color: OTHERS_COLOR,
            total: items.slice(MAX_SLICES).reduce((sum, item) => sum + item.total, 0),
            percentage: items.slice(MAX_SLICES).reduce((sum, item) => sum + item.percentage, 0),
          },
        ]
      : items.map((item) => ({
          key: item.category.id,
          name: item.category.name,
          icon: item.category.icon,
          color: item.category.color,
          total: item.total,
          percentage: item.percentage,
        }));

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-4">
      <div className="w-full shrink-0 sm:w-[150px]">
        <ResponsiveContainer width="100%" height={150}>
          <PieChart>
            <Pie
              data={slices}
              dataKey="total"
              nameKey="name"
              innerRadius={46}
              outerRadius={68}
              paddingAngle={3}
              cornerRadius={4}
              stroke="none"
              animationDuration={700}
              animationEasing="ease-out"
            >
              {slices.map((slice) => (
                <Cell key={slice.key} fill={slice.color} />
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
              formatter={(value, _name, item) => [formatCurrency(Number(value)), item.payload.name]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="w-full min-w-0 flex-1 space-y-2.5">
        {slices.map((slice) => (
          <div key={slice.key} className="flex items-center gap-2.5 text-sm">
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
              style={{ background: `${slice.color}1f`, color: slice.color }}
            >
              <DynamicIcon name={slice.icon} size={12} />
            </span>
            <span className="min-w-0 flex-1 truncate text-foreground">{slice.name}</span>
            <span className="shrink-0 text-xs text-muted-foreground">
              {slice.percentage.toFixed(0)}%
            </span>
            <span className="shrink-0 text-right font-medium text-foreground">
              {formatCurrency(slice.total)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
