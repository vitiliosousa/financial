"use client";

import { cn } from "@/lib/cn";

export const PALETTE = [
  { color: "#d9a72c", name: "Dourado" },
  { color: "#e8c468", name: "Amarelo manteiga" },
  { color: "#d9738f", name: "Rosa" },
  { color: "#c9694f", name: "Terracota" },
  { color: "#e0916b", name: "Pêssego" },
  { color: "#8fae6b", name: "Verde-sálvia" },
  { color: "#9a9548", name: "Verde-oliva" },
  { color: "#6bb3a0", name: "Verde-água" },
  { color: "#6fa8dc", name: "Azul-pó" },
  { color: "#5fa8b8", name: "Ciano" },
  { color: "#a88fd1", name: "Lavanda" },
  { color: "#9b6b9e", name: "Ameixa" },
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
      {PALETTE.map(({ color, name }) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          aria-label={`${name}${value === color ? " (selecionado)" : ""}`}
          aria-pressed={value === color}
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
