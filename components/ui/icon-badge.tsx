import type { IconName } from "@/lib/types";
import { DynamicIcon } from "./icon";
import { cn } from "@/lib/cn";

export function IconBadge({
  icon,
  color,
  size = "md",
  className,
}: {
  icon: IconName;
  color: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };
  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 22,
  };
  return (
    <div
      className={cn("flex shrink-0 items-center justify-center rounded-full", sizes[size], className)}
      style={{ background: `${color}1f`, color }}
    >
      <DynamicIcon name={icon} size={iconSizes[size]} />
    </div>
  );
}
