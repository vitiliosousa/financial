"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MaterialIcon } from "@/components/ui/material-icon";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 600);
  }

  return (
    <Card>
      <CardContent className="p-6">
        {sent ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success-soft text-success">
              <MaterialIcon name="check_circle" size={26} filled />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Verifique o seu e-mail</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Enviámos as instruções de recuperação de palavra-passe para o seu e-mail.
              </p>
            </div>
            <Link href="/login" className="mt-2">
              <Button variant="outline">Voltar ao início de sessão</Button>
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-xl font-bold text-foreground">Recuperar palavra-passe</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Introduza o seu e-mail e enviaremos instruções para redefinir a sua palavra-passe.
            </p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" required placeholder="ola@exemplo.com" />
              </div>

              <Button type="submit" className="w-full" loading={loading}>
                Enviar instruções
              </Button>
            </form>

            <Link
              href="/login"
              className="mt-6 flex items-center justify-center gap-1.5 text-sm font-medium text-accent hover:underline"
            >
              <MaterialIcon name="arrow_back" size={16} />
              Voltar ao início de sessão
            </Link>
          </>
        )}
      </CardContent>
    </Card>
  );
}
