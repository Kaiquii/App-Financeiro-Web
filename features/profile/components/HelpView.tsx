"use client";

import { Mail, Phone } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";

const helpSections = [
  {
    text: "Use o app para acompanhar suas entradas, despesas, categorias e relatórios mensais. Mantenha os cadastros atualizados para que os saldos fiquem corretos.",
    title: "Como usar o app",
  },
  {
    text: "A tela inicial mostra um resumo do mês selecionado, com entradas, gastos e saldo disponível para ajudar na leitura rápida da sua situação financeira.",
    title: "Tela inicial",
  },
  {
    text: "Na área de despesas, informe valor, descrição, categoria, origem de pagamento, data e tipo. Despesas parceladas também precisam da quantidade de parcelas.",
    title: "Cadastrar despesas",
  },
  {
    text: "Edite ou exclua despesas pela listagem. Em despesas parceladas ou fixas, o app pode perguntar se a mudança vale apenas para o registro atual ou também para os próximos.",
    title: "Gerenciar despesas",
  },
  {
    text: "Na área de Perfil, acesse Configurações de Renda para cadastrar salário, adiantamento e renda extra. Cada renda pode ser criada, atualizada ou removida por mês.",
    title: "Rendas",
  },
  {
    text: "Em Perfil, acesse Categorias para criar, editar ou excluir categorias. Se uma categoria estiver em uso, o servidor pode bloquear a exclusão e mostrar uma mensagem.",
    title: "Categorias",
  },
  {
    text: "A tela de Relatórios mostra gastos por categoria, comparativo de renda versus despesas e resumo anual com base nos dados cadastrados.",
    title: "Relatórios",
  },
  {
    text: "No web, o acesso protegido usa sua sessão salva no navegador. Sempre saia da conta quando estiver usando um dispositivo compartilhado.",
    title: "Biometria",
  },
];

type ContactItemProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

function ContactItem({ icon, label, value }: ContactItemProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/60">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
          {label}
        </span>
        <span className="mt-1 block truncate text-sm font-semibold text-slate-950 dark:text-slate-50">
          {value}
        </span>
      </span>
    </div>
  );
}

type HelpSectionProps = {
  text: string;
  title: string;
};

function HelpSection({ text, title }: HelpSectionProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h3 className="font-semibold text-slate-950 dark:text-slate-50">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
        {text}
      </p>
    </article>
  );
}

export function HelpView() {
  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-5">
      <PageHeader
        backHref="/perfil"
        eyebrow="Central de Ajuda"
        title="Dúvidas frequentes e suporte"
      />

      <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="font-semibold text-slate-950 dark:text-slate-50">Contato</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <ContactItem
            icon={<Phone aria-hidden="true" size={19} strokeWidth={2.25} />}
            label="WhatsApp"
            value="11 93367-3435"
          />
          <ContactItem
            icon={<Mail aria-hidden="true" size={19} strokeWidth={2.25} />}
            label="E-mail"
            value="kaiqui.lucaskaiquiluc@gmail.com"
          />
        </div>
      </article>

      <div className="grid gap-3">
        {helpSections.map((section) => (
          <HelpSection key={section.title} text={section.text} title={section.title} />
        ))}
      </div>
    </section>
  );
}
