import { cn } from "@/lib/cn";

export function MaterialIcon({
  name,
  className,
  size = 20,
  filled = false,
  weight = 400,
}: {
  name: string;
  className?: string;
  size?: number;
  filled?: boolean;
  weight?: 300 | 400 | 500 | 600;
}) {
  return (
    <span
      className={cn("material-symbols-outlined select-none", className)}
      style={{
        fontSize: size,
        width: size,
        height: size,
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' ${weight}, 'GRAD' 0, 'opsz' ${size}`,
      }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}
