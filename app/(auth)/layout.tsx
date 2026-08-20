import Link from "next/link";
import { MaterialIcon } from "@/components/ui/material-icon";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-sm animate-fade-in">
        <Link href="/login" className="mb-8 flex items-center justify-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <MaterialIcon name="bolt" size={20} filled />
          </div>
          <span className="text-lg font-bold text-foreground">Finanças</span>
        </Link>
        {children}
      </div>
    </div>
  );
}
