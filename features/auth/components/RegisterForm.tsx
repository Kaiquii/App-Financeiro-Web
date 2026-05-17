"use client";

import { ArrowRight, Mail, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { useAuthStore } from "@/features/auth/store/useAuthStore";

export function RegisterForm() {
  const router = useRouter();
  const { clearFeedback, error, isLoading, message, register } = useAuthStore();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await register({ email, name, password });
      router.push("/login");
    } catch {}
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Criar conta</CardTitle>
        <CardDescription>Cadastre seus dados para iniciar o acesso.</CardDescription>
      </CardHeader>

      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <div className="relative">
              <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                autoComplete="name"
                className="pl-10"
                disabled={isLoading}
                id="name"
                name="name"
                onChange={(event) => {
                  clearFeedback();
                  setName(event.target.value);
                }}
                placeholder="Seu nome"
                required
                type="text"
                value={name}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                autoComplete="email"
                className="pl-10"
                disabled={isLoading}
                id="email"
                name="email"
                onChange={(event) => {
                  clearFeedback();
                  setEmail(event.target.value);
                }}
                placeholder="voce@email.com"
                required
                type="email"
                value={email}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <PasswordInput
              autoComplete="new-password"
              disabled={isLoading}
              id="password"
              minLength={4}
              name="password"
              onChange={(event) => {
                clearFeedback();
                setPassword(event.target.value);
              }}
              placeholder="Crie uma senha"
              required
              value={password}
            />
          </div>

          {error ? <Alert variant="error">{error}</Alert> : null}
          {message ? <Alert variant="success">{message}</Alert> : null}

          <Button className="w-full" disabled={isLoading} type="submit">
            {isLoading ? "Criando..." : "Criar conta"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          Já tem uma conta?{" "}
          <Link
            className="font-semibold text-emerald-700 underline-offset-4 hover:underline dark:text-emerald-300"
            href="/login"
          >
            Entrar
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
