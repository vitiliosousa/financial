"use client";

import { cn } from "@/lib/cn";

export const PALETTE = [
  "#6d5ef8",
  "#22c55e",
  "#3b82f6",
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#84cc16",
  "#14b8a6",
  "#06b6d4",
  "#8b5cf6",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
  "#a855f7",
  "#0ea5e9",
  "#64748b",
];

export function ColorPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (color: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 rounded-[var(--radius-sm)] border border-border bg-surface p-3">
      {PALETTE.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          className={cn(
            "h-7 w-7 rounded-full transition-transform hover:scale-110",
            value === color && "ring-2 ring-offset-2 ring-offset-surface"
          )}
          style={{ background: color, ...(value === color ? ({ "--tw-ring-color": color } as React.CSSProperties) : {}) }}
        />
      ))}
    </div>
  );
}
