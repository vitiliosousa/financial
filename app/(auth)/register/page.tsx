"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 500);
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h1 className="text-xl font-bold text-foreground">Criar conta</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Comece a organizar a sua vida financeira em minutos.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="name">Nome completo</Label>
            <Input id="name" required placeholder="O seu nome" defaultValue="Vitílio Martins" />
          </div>
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              required
              placeholder="ola@exemplo.com"
              defaultValue="vitiliomartins2003@gmail.com"
            />
          </div>
          <div>
            <Label htmlFor="password">Palavra-passe</Label>
            <Input id="password" type="password" required placeholder="••••••••" />
          </div>
          <div>
            <Label htmlFor="confirm-password">Confirmar palavra-passe</Label>
            <Input id="confirm-password" type="password" required placeholder="••••••••" />
          </div>

          <Button type="submit" className="w-full" loading={loading}>
            Criar conta
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Já tem conta?{" "}
          <Link href="/login" className="font-medium text-accent hover:underline">
            Iniciar sessão
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
