"use client";

import { useState, type InputHTMLAttributes } from "react";
import { Input } from "./input";
import { MaterialIcon } from "./material-icon";
import { cn } from "@/lib/cn";

export function PasswordInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input type={visible ? "text" : "password"} className={cn("pr-10", className)} {...props} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        tabIndex={-1}
        aria-label={visible ? "Ocultar palavra-passe" : "Mostrar palavra-passe"}
      >
        <MaterialIcon name={visible ? "visibility_off" : "visibility"} size={18} />
      </button>
    </div>
  );
}
