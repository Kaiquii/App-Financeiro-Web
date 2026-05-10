"use client";

import { Home, LogOut, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuthStore } from "@/features/auth/store/useAuthStore";

type HeaderProps = {
  onOpenSidebar: () => void;
};

export function Header({ onOpenSidebar }: HeaderProps) {
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  function handleLogout() {
    logout();
    setIsLogoutDialogOpen(false);
    router.replace("/login");
  }

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-slate-100/95 px-4 py-2 text-slate-950 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 dark:text-slate-50 sm:px-6 lg:px-8">
        <div className="flex w-full items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Button
              aria-label="Abrir menu"
              className="shrink-0 rounded-full border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900"
              onClick={onOpenSidebar}
              size="iconSm"
              title="Abrir menu"
              type="button"
              variant="secondary"
            >
              <Menu aria-hidden="true" size={17} strokeWidth={2.25} />
            </Button>

            <div className="min-w-0">
              <h1 className="truncate text-sm font-semibold text-slate-950 dark:text-slate-50 sm:text-base">
                App Financeiro
              </h1>
              {user?.name ? (
                <p className="hidden truncate text-xs text-slate-500 dark:text-slate-400 sm:block">
                  Ola, {user.name}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              aria-label="Ir para home"
              className="rounded-full border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900"
              onClick={() => router.push("/home")}
              size="iconSm"
              title="Home"
              type="button"
              variant="secondary"
            >
              <Home aria-hidden="true" size={16} strokeWidth={2.25} />
            </Button>
            <ThemeToggle
              className="h-8 w-8 rounded-full border border-slate-300 bg-white p-0 dark:border-slate-700 dark:bg-slate-900"
              iconSize={16}
            />
            <Button
              className="hidden rounded-full border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900 sm:inline-flex"
              onClick={() => setIsLogoutDialogOpen(true)}
              size="sm"
              type="button"
              variant="secondary"
            >
              <LogOut aria-hidden="true" size={14} strokeWidth={2.25} />
              Sair
            </Button>
            <Button
              aria-label="Sair"
              className="rounded-full border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900 sm:hidden"
              onClick={() => setIsLogoutDialogOpen(true)}
              size="iconSm"
              title="Sair"
              type="button"
              variant="secondary"
            >
              <LogOut aria-hidden="true" size={14} strokeWidth={2.25} />
            </Button>
          </div>
        </div>
      </header>

      <ConfirmationDialog
        confirmLabel="Sim, sair"
        description="Voce sera desconectado da sua conta e precisara fazer login novamente para acessar o painel."
        isOpen={isLogoutDialogOpen}
        onClose={() => setIsLogoutDialogOpen(false)}
        onConfirm={handleLogout}
        title="Tem certeza que deseja sair?"
        tone="danger"
      />
    </>
  );
}
