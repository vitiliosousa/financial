"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useFinanceStore } from "@/lib/store";
import { useToastStore } from "@/lib/toast-store";
import { useTheme } from "@/components/theme-provider";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ColorPicker } from "@/components/ui/color-picker";
import { MaterialIcon } from "@/components/ui/material-icon";
import { cn } from "@/lib/cn";
import { changePasswordAction } from "@/lib/actions/user";

export default function SettingsPage() {
  const user = useFinanceStore((s) => s.user);
  const updateUser = useFinanceStore((s) => s.updateUser);
  const showToast = useToastStore((s) => s.show);
  const { theme, setTheme } = useTheme();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [avatarColor, setAvatarColor] = useState(user.avatarColor);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);

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

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 8) {
      setPasswordError("A nova palavra-passe deve ter pelo menos 8 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("As palavras-passe não coincidem.");
      return;
    }
    try {
      await changePasswordAction({ currentPassword, newPassword });
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Erro ao alterar palavra-passe.");
      return;
    }
    setPasswordError(null);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    showToast("Palavra-passe alterada com sucesso.");
  }

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-4 pb-8">
        <div className="relative shrink-0">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full text-xl font-medium text-white"
            style={{ background: avatarColor }}
          >
            {initials}
          </div>
          <button
            type="button"
            onClick={() => setColorPickerOpen((v) => !v)}
            className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground shadow-sm transition-colors hover:text-foreground"
            aria-label="Alterar cor do avatar"
          >
            <MaterialIcon name="palette" size={13} />
          </button>
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold text-foreground">{user.name}</h1>
          <p className="truncate text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      {colorPickerOpen && (
        <div className="mb-8">
          <Label>Cor do avatar</Label>
          <ColorPicker value={avatarColor} onChange={setAvatarColor} />
        </div>
      )}

      <section className="border-t border-border py-8">
        <h2 className="text-sm font-semibold text-foreground">Perfil</h2>
        <p className="mt-1 text-xs text-muted-foreground">Atualize as suas informações pessoais</p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
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
            <Button type="submit" size="sm">
              Guardar alterações
            </Button>
          </div>
        </form>
      </section>

      <section className="border-t border-border py-8">
        <h2 className="text-sm font-semibold text-foreground">Segurança</h2>
        <p className="mt-1 text-xs text-muted-foreground">Altere a sua palavra-passe de acesso</p>

        <form onSubmit={handlePasswordSubmit} className="mt-5 space-y-4">
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
            <Button type="submit" size="sm">
              Alterar palavra-passe
            </Button>
          </div>
        </form>
      </section>

      <section className="border-t border-border py-8">
        <h2 className="text-sm font-semibold text-foreground">Aparência</h2>
        <p className="mt-1 text-xs text-muted-foreground">Personalize o tema da aplicação</p>

        <div className="mt-4 inline-flex w-fit gap-1 rounded-[var(--radius-md)] border border-border bg-surface p-1">
          <button
            type="button"
            onClick={() => setTheme("light")}
            className={cn(
              "flex items-center gap-2 rounded-[var(--radius-sm)] px-3 py-1.5 text-sm font-medium transition-colors",
              theme === "light" ? "bg-primary-soft text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <MaterialIcon name="light_mode" size={17} />
            Claro
          </button>
          <button
            type="button"
            onClick={() => setTheme("dark")}
            className={cn(
              "flex items-center gap-2 rounded-[var(--radius-sm)] px-3 py-1.5 text-sm font-medium transition-colors",
              theme === "dark" ? "bg-primary-soft text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <MaterialIcon name="dark_mode" size={17} />
            Escuro
          </button>
        </div>
      </section>

      <section className="border-t border-border py-8">
        <h2 className="text-sm font-semibold text-foreground">Sessão</h2>
        <p className="mt-1 text-xs text-muted-foreground">Terminar a sessão atual neste dispositivo</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => signOut({ callbackUrl: "/login" })}>
          <MaterialIcon name="logout" size={16} />
          Terminar sessão
        </Button>
      </section>
    </div>
  );
}
