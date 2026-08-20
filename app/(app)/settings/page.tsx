"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFinanceStore } from "@/lib/store";
import { useToastStore } from "@/lib/toast-store";
import { useTheme } from "@/components/theme-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ColorPicker } from "@/components/ui/color-picker";
import { MaterialIcon } from "@/components/ui/material-icon";
import { cn } from "@/lib/cn";

export default function SettingsPage() {
  const router = useRouter();
  const user = useFinanceStore((s) => s.user);
  const updateUser = useFinanceStore((s) => s.updateUser);
  const showToast = useToastStore((s) => s.show);
  const { theme, setTheme } = useTheme();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [avatarColor, setAvatarColor] = useState(user.avatarColor);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateUser({ name: name.trim(), email: email.trim(), avatarColor });
    showToast("Perfil atualizado com sucesso.");
  }

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 8) {
      setPasswordError("A nova palavra-passe deve ter pelo menos 8 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("As palavras-passe não coincidem.");
      return;
    }
    setPasswordError(null);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    showToast("Palavra-passe alterada com sucesso.");
  }

  return (
    <div className="max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Perfil</CardTitle>
            <CardDescription>Atualize as suas informações pessoais</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-4">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full text-lg font-medium text-white"
                style={{ background: avatarColor }}
              >
                {initials}
              </div>
              <div className="flex-1">
                <Label>Cor do avatar</Label>
                <ColorPicker value={avatarColor} onChange={setAvatarColor} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="profile-name">Nome completo</Label>
                <Input id="profile-name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="profile-email">E-mail</Label>
                <Input
                  id="profile-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit">
                <MaterialIcon name="save" size={18} />
                Guardar alterações
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Segurança</CardTitle>
            <CardDescription>Altere a sua palavra-passe de acesso</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <Label htmlFor="current-password">Palavra-passe atual</Label>
              <Input
                id="current-password"
                type="password"
                required
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="new-password">Nova palavra-passe</Label>
                <Input
                  id="new-password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="confirm-new-password">Confirmar nova palavra-passe</Label>
                <Input
                  id="confirm-new-password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            {passwordError && <p className="text-xs text-danger">{passwordError}</p>}
            <div className="flex justify-end">
              <Button type="submit">
                <MaterialIcon name="lock_reset" size={18} />
                Alterar palavra-passe
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Aparência</CardTitle>
            <CardDescription>Personalize o tema da aplicação</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setTheme("light")}
              className={cn(
                "flex flex-col items-center gap-2 rounded-[var(--radius-md)] border p-4 transition-colors",
                theme === "light" ? "border-accent bg-accent-soft" : "border-border hover:bg-surface-hover"
              )}
            >
              <MaterialIcon name="light_mode" size={22} />
              <span className="text-sm font-medium">Claro</span>
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={cn(
                "flex flex-col items-center gap-2 rounded-[var(--radius-md)] border p-4 transition-colors",
                theme === "dark" ? "border-accent bg-accent-soft" : "border-border hover:bg-surface-hover"
              )}
            >
              <MaterialIcon name="dark_mode" size={22} />
              <span className="text-sm font-medium">Escuro</span>
            </button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Sessão</CardTitle>
            <CardDescription>Terminar a sessão atual</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={() => router.push("/login")}>
            <MaterialIcon name="logout" size={18} />
            Terminar sessão
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
