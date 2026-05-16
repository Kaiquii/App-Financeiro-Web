"use client";

import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import type { InputHTMLAttributes } from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export function PasswordInput({ className, disabled, ...props }: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);
  const Icon = isVisible ? EyeOff : Eye;

  return (
    <div className="relative">
      <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <Input
        className={cn("pl-10 pr-12", className)}
        disabled={disabled}
        type={isVisible ? "text" : "password"}
        {...props}
      />
      <Button
        aria-label={isVisible ? "Ocultar senha" : "Mostrar senha"}
        className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full p-0 text-slate-500 hover:bg-slate-100 hover:text-emerald-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-emerald-300"
        disabled={disabled}
        onClick={() => setIsVisible((current) => !current)}
        size="iconSm"
        title={isVisible ? "Ocultar senha" : "Mostrar senha"}
        type="button"
        variant="ghost"
      >
        <Icon aria-hidden="true" size={18} strokeWidth={2.25} />
      </Button>
    </div>
  );
}
