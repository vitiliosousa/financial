"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MaterialIcon } from "@/components/ui/material-icon";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("vitiliomartins2003@gmail.com");
  const [password, setPassword] = useState("");

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
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                <MaterialIcon name={showPassword ? "visibility_off" : "visibility"} size={18} />
              </button>
            </div>
          </div>

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
