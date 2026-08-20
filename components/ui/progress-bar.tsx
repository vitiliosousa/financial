import { cn } from "@/lib/cn";

export function ProgressBar({
  value,
  className,
  trackClassName,
  color,
  height = 8,
}: {
  value: number;
  className?: string;
  trackClassName?: string;
  color?: string;
  height?: number;
}) {
  const clamped = Math.min(Math.max(value, 0), 100);
  return (
    <div
      className={cn("w-full overflow-hidden rounded-full bg-surface-hover", trackClassName)}
      style={{ height }}
    >
      <div
        className={cn("h-full rounded-full transition-all duration-500 ease-out", className)}
        style={{ width: `${clamped}%`, background: color }}
      />
    </div>
  );
}
