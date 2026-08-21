"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await signIn("credentials", { email, password, redirect: false });
    if (result?.error) {
      setLoading(false);
      setError("E-mail ou palavra-passe incorretos.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h1 className="text-xl font-bold text-foreground">Iniciar sessão</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Aceda à sua conta para continuar a gerir as suas finanças.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              required
              placeholder="ola@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="mb-1.5">
                Palavra-passe
              </Label>
              <Link href="/forgot-password" className="mb-1.5 text-xs font-medium text-accent hover:underline">
                Esqueceu-se?
              </Link>
            </div>
            <PasswordInput
              id="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-xs text-danger">{error}</p>}

          <Button type="submit" className="w-full" loading={loading}>
            Entrar
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Ainda não tem conta?{" "}
          <Link href="/register" className="font-medium text-accent hover:underline">
            Criar conta
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
