"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useFinanceStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";
import { QuickSetupPanel } from "@/components/accounts/quick-setup-panel";

export function OnboardingScreen() {
  const router = useRouter();
  const name = useFinanceStore((s) => s.user.name);
  const firstName = name.trim().split(" ")[0] || name;

  function finish() {
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto flex w-full max-w-2xl items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5 text-foreground">
          <Logo width={30} height={24} />
          <span className="text-lg font-bold text-foreground">Onazi</span>
        </Link>
        <button
          type="button"
          onClick={finish}
          className="text-sm font-medium text-muted-foreground hover:text-foreground hover:underline"
        >
          Saltar por agora
        </button>
      </div>

      <div className="mx-auto mt-8 w-full max-w-2xl animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground">Bem-vindo(a), {firstName}!</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Vamos deixar a sua conta pronta. Comece por indicar as suas contas e saldos, depois
          escolha categorias, metas e orçamentos — tudo aqui é opcional, pode fazer isto mais
          tarde a partir do menu.
        </p>

        <Card className="mt-6">
          <CardContent className="p-6">
            <QuickSetupPanel onDone={finish} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
