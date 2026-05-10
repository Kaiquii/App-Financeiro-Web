"use client";

import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useThemeStore } from "@/store/useThemeStore";

type ThemeToggleProps = {
  className?: string;
  iconSize?: number;
};

export function ThemeToggle({ className, iconSize = 22 }: ThemeToggleProps) {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const Icon = theme === "dark" ? Sun : Moon;

  return (
    <Button
      aria-label={theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}
      className={cn("rounded-full", className)}
      onClick={toggleTheme}
      size="iconSm"
      title={theme === "dark" ? "Tema claro" : "Tema escuro"}
      type="button"
      variant="secondary"
    >
      <Icon aria-hidden="true" className="shrink-0" size={iconSize} strokeWidth={2.25} />
    </Button>
  );
}
