import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { MaterialIcon } from "@/components/ui/material-icon";
import { cn } from "@/lib/cn";

// Solid, theme-aware seed colors (each already has a light/dark pair defined
// in globals.css) — filled cards mix these toward --surface so they stay
// visible in both themes instead of relying on hardcoded hex per theme.
export const TONE_VARS = {
  primary: "var(--accent)",
  success: "var(--success)",
  danger: "var(--danger)",
  info: "var(--info)",
};

export function StatCard({
  label,
  value,
  icon,
  tone = "primary",
  trend,
  footer,
  filled = false,
}: {
  label: string;
  value: string;
  icon: string;
  tone?: "primary" | "success" | "danger" | "info";
  trend?: { value: number; label: string };
  footer?: ReactNode;
  filled?: boolean;
}) {
  const toneClasses = {
    primary: "bg-primary-soft text-primary",
    success: "bg-success-soft text-success",
    danger: "bg-danger-soft text-danger",
    info: "bg-info-soft text-info",
  };

  return (
    <Card className="relative flex h-full flex-col justify-center overflow-hidden p-5">
      {filled && (
        <MaterialIcon
          name={icon}
          size={96}
          filled
          className="pointer-events-none absolute -bottom-4 -right-4 opacity-[0.18]"
          style={{ color: TONE_VARS[tone] }}
        />
      )}
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="font-tabular mt-2 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
        </div>
        {!filled && (
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-full", toneClasses[tone])}>
            <MaterialIcon name={icon} size={20} />
          </div>
        )}
      </div>
      {trend && (
        <div className="relative mt-3 flex items-center gap-1 text-xs">
          <span
            className={cn(
              "flex items-center gap-0.5 font-medium",
              trend.value >= 0 ? "text-success" : "text-danger"
            )}
          >
            <MaterialIcon name={trend.value >= 0 ? "arrow_upward" : "arrow_downward"} size={14} />
            {Math.abs(trend.value).toFixed(0)}%
          </span>
          <span className="text-muted-foreground">{trend.label}</span>
        </div>
      )}
      {footer && <div className="relative mt-3 text-xs text-muted-foreground">{footer}</div>}
    </Card>
  );
}
