import type { ReactNode } from "react";
import { MaterialIcon } from "./material-icon";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-[var(--radius-lg)] bg-surface-hover/60 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface text-muted-foreground">
        <MaterialIcon name={icon} size={26} />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description && <p className="mt-1 max-w-xs text-xs text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}
