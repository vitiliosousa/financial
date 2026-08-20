import { type InputHTMLAttributes, type LabelHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

export const Label = ({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) => (
  <label className={cn("mb-1.5 block text-xs font-medium text-muted-foreground", className)} {...props} />
);

const fieldBase =
  "w-full rounded-[var(--radius-sm)] border border-border bg-surface text-foreground placeholder:text-muted-foreground/70 transition-colors " +
  "focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(fieldBase, "h-9 px-3 text-sm", className)} {...props} />
  )
);
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn(fieldBase, "px-3 py-2", "text-sm", className)} {...props} />
  )
);
Textarea.displayName = "Textarea";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select ref={ref} className={cn(fieldBase, "h-9 px-3 text-sm", className)} {...props}>
      {children}
    </select>
  )
);
Select.displayName = "Select";
