import { MaterialIcon } from "./material-icon";

export function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="flex h-8 items-center gap-1 rounded-[var(--radius-sm)] px-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover disabled:pointer-events-none disabled:opacity-40"
      >
        <MaterialIcon name="chevron_left" size={18} />
        Anterior
      </button>
      <p className="text-xs text-muted-foreground">
        Página {page} de {totalPages}
      </p>
      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        className="flex h-8 items-center gap-1 rounded-[var(--radius-sm)] px-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover disabled:pointer-events-none disabled:opacity-40"
      >
        Seguinte
        <MaterialIcon name="chevron_right" size={18} />
      </button>
    </div>
  );
}
