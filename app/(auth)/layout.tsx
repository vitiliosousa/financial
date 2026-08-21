import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Logo } from "@/components/ui/logo";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (session?.user?.id) redirect("/dashboard");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-sm animate-fade-in">
        <Link href="/login" className="mb-8 flex items-center justify-center gap-2.5 text-foreground">
          <Logo width={30} height={24} />
          <span className="text-lg font-bold text-foreground">Onazi</span>
        </Link>
        {children}
      </div>
    </div>
  );
}
