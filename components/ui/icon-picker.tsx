"use client";

import type { IconName } from "@/lib/types";
import { DynamicIcon, ICON_NAMES } from "./icon";
import { cn } from "@/lib/cn";

export function IconPicker({
  value,
  onChange,
  color,
}: {
  value: IconName;
  onChange: (icon: IconName) => void;
  color: string;
}) {
  return (
    <div className="grid grid-cols-8 gap-2 rounded-[var(--radius-sm)] border border-border bg-surface p-3">
      {ICON_NAMES.map((name) => (
        <button
          key={name}
          type="button"
          onClick={() => onChange(name)}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] transition-all",
            value === name ? "ring-2 ring-offset-1 ring-offset-surface" : "hover:bg-surface-hover"
          )}
          style={
            value === name
              ? ({ background: `${color}1f`, color, "--tw-ring-color": color } as React.CSSProperties)
              : undefined
          }
        >
          <DynamicIcon name={name} size={16} />
        </button>
      ))}
    </div>
  );
}
