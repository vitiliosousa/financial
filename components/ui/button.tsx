import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
  secondary: "bg-primary-soft text-foreground hover:bg-border/60",
  outline: "border border-border bg-transparent text-foreground hover:bg-surface-hover",
  ghost: "bg-transparent text-foreground hover:bg-surface-hover",
  danger: "bg-danger text-white hover:opacity-90",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-[13px] gap-1.5",
  md: "h-9 px-3.5 text-sm gap-1.5",
  lg: "h-11 px-5 text-sm gap-2",
  icon: "h-9 w-9 shrink-0",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center rounded-[var(--radius-sm)] font-medium transition-colors duration-100 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40 cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {loading && (
          <span className="animate-spinner h-3.5 w-3.5 shrink-0 rounded-full border-2 border-current border-t-transparent opacity-70" />
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
