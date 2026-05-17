"use client";

import {
  BarChart3,
  Pencil,
  PiggyBank,
  Plus,
  ReceiptText,
  Trash2,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  getCurrentMonthReference,
  MonthSwitcher,
} from "@/components/ui/month-switcher";
import {
  IncomeShortcutDialog,
  type IncomeShortcut,
  type IncomeShortcutAction,
} from "@/features/incomes/components/IncomeShortcutDialog";
import type { IncomeSource } from "@/features/incomes/types/income";
import { summaryApi } from "@/features/summary/api/summaryApi";
import type { MonthlySummary } from "@/features/summary/types/summary";
import { formatMoney } from "@/lib/formatters";
import { cn } from "@/lib/utils";

const monthFormatter = new Intl.DateTimeFormat("pt-BR", {
  month: "long",
  year: "numeric",
});

type SummaryCardProps = {
  action?: React.ReactNode;
  className?: string;
  hint?: string;
  icon?: React.ReactNode;
  label: string;
  tone?:
    | "balance"
    | "expense"
    | "extra"
    | "income"
    | "remaining"
    | "source"
    | "spent";
  value: number;
};

type AmountState = "negative" | "positive" | "zero";

function getAmountState(value: number): AmountState {
  if (value < 0) {
    return "negative";
  }

  if (value === 0) {
    return "zero";
  }

  return "positive";
}

function SummaryCard({
  action,
  className,
  hint,
  icon,
  label,
  tone = "balance",
  value,
}: SummaryCardProps) {
  const amountState = getAmountState(value);
  const isFeatured = tone === "balance";
  const isRemaining = tone === "remaining";
  const isExtra = tone === "extra";
  const isExpenseTone = tone === "expense" || tone === "spent";

  return (
    <article
      className={cn(
        "relative min-h-33 overflow-hidden rounded-[1.35rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700/45 dark:bg-slate-800/75",
        "after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/40 after:content-[''] dark:after:bg-white/5",
        isFeatured &&
          "min-h-38 bg-blue-100 p-6 dark:border-blue-900/45 dark:bg-blue-950",
        isRemaining &&
          "border-violet-200 bg-violet-100/85 dark:border-violet-900/35 dark:bg-violet-950/70",
        isExtra &&
          "border-slate-200 bg-slate-50 dark:border-slate-700/45 dark:bg-slate-800/75",
        isExpenseTone &&
          "border-slate-200 bg-slate-50 dark:border-slate-700/45 dark:bg-slate-800/75",
        amountState === "negative" &&
          "border-red-300 bg-red-50 dark:border-red-900/60 dark:bg-red-950/25",
        className,
      )}
    >
      <div className="flex h-full flex-col justify-between gap-5">
        <div className="flex items-start justify-between gap-4">
          <p
            className={cn(
              "text-sm font-medium text-slate-500 dark:text-slate-400",
              isFeatured && "text-blue-700/70 dark:text-blue-200/55",
              isRemaining && "text-violet-700/70 dark:text-violet-200/55",
              amountState === "negative" &&
                "text-red-700/80 dark:text-red-200/75",
            )}
          >
            {label}
          </p>
          {action ? (
            <div className="flex shrink-0 items-center gap-1">{action}</div>
          ) : null}
        </div>

        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <strong
              className={cn(
                "block wrap-break-word text-2xl font-semibold tracking-normal text-slate-950 dark:text-white sm:text-3xl",
                isFeatured &&
                  "text-3xl text-blue-700 dark:text-blue-400 sm:text-4xl",
                isExtra && "text-emerald-600 dark:text-emerald-400",
                isRemaining && "text-violet-950 dark:text-white",
                isExpenseTone && "text-slate-950 dark:text-white",
                amountState === "zero" &&
                  isExtra &&
                  "text-emerald-600 dark:text-emerald-400",
                amountState === "negative" && "text-red-600 dark:text-red-300",
              )}
            >
              {formatMoney(value)}
            </strong>
            {hint ? (
              <p
                className={cn(
                  "mt-2 text-sm font-medium text-slate-500 dark:text-slate-500",
                  isFeatured && "text-blue-700/60 dark:text-blue-200/45",
                  amountState === "negative" &&
                    "text-red-700/70 dark:text-red-200/60",
                )}
              >
                {hint}
              </p>
            ) : null}
          </div>
          {icon ? (
            <div
              className={cn(
                "shrink-0 text-slate-500 dark:text-slate-100",
                isFeatured && "text-blue-700 dark:text-blue-500",
                isExtra && "text-emerald-600 dark:text-emerald-500",
                amountState === "negative" && "text-red-500 dark:text-red-400",
              )}
            >
              {icon}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

type IncomeActionProps = {
  amount: number;
  month: number;
  onOpen: (shortcut: IncomeShortcut) => void;
  source: IncomeSource;
  year: number;
};

function getShortcut({
  action,
  amount,
  month,
  source,
  year,
}: Omit<IncomeActionProps, "onOpen"> & { action: IncomeShortcutAction }) {
  return {
    action,
    amount,
    month,
    source,
    year,
  };
}

function IncomeActions({
  amount,
  month,
  onOpen,
  source,
  year,
}: IncomeActionProps) {
  if (amount <= 0) {
    return (
      <button
        aria-label={`Criar ${source}`}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-400"
        onClick={() =>
          onOpen(getShortcut({ action: "create", amount, month, source, year }))
        }
        title={`Criar ${source}`}
        type="button"
      >
        <Plus aria-hidden="true" size={22} strokeWidth={2.4} />
      </button>
    );
  }

  return (
    <>
      <button
        aria-label={`Editar ${source}`}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-blue-500 hover:bg-blue-500/10 hover:text-blue-400"
        onClick={() =>
          onOpen(getShortcut({ action: "edit", amount, month, source, year }))
        }
        title={`Editar ${source}`}
        type="button"
      >
        <Pencil aria-hidden="true" size={18} strokeWidth={2.4} />
      </button>
      <button
        aria-label={`Excluir ${source}`}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-red-400 hover:bg-red-500/10 hover:text-red-300"
        onClick={() =>
          onOpen(getShortcut({ action: "delete", amount, month, source, year }))
        }
        title={`Excluir ${source}`}
        type="button"
      >
        <Trash2 aria-hidden="true" size={18} strokeWidth={2.4} />
      </button>
    </>
  );
}

function SummarySkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 9 }).map((_, index) => (
        <div
          className={cn(
            "h-36 animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900",
            index === 0 && "md:col-span-2 xl:col-span-4",
            index === 4 && "md:col-span-2 xl:col-span-4",
          )}
          key={index}
        />
      ))}
    </div>
  );
}

export function MonthlySummaryView() {
  const [{ month, year }, setSelectedDate] = useState(getCurrentMonthReference);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [incomeShortcut, setIncomeShortcut] = useState<IncomeShortcut | null>(
    null,
  );
  const [refreshKey, setRefreshKey] = useState(0);
  const [summary, setSummary] = useState<MonthlySummary | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadSummary() {
      try {
        setError(null);
        setIsLoading(true);
        const response = await summaryApi.getMonthlySummary(month, year);

        if (isMounted) {
          setSummary(response);
        }
      } catch {
        if (isMounted) {
          setError("Não foi possível carregar o resumo mensal.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadSummary();

    return () => {
      isMounted = false;
    };
  }, [month, refreshKey, year]);

  const monthLabel = useMemo(() => {
    const date = new Date(year, month - 1, 1);
    return monthFormatter.format(date);
  }, [month, year]);

  const gastoSalario = summary
    ? Math.max(summary.salario - summary.restante_salario, 0)
    : 0;
  const gastoAdiantamento = summary
    ? Math.max(summary.adiantamento - summary.restante_adiantamento, 0)
    : 0;

  return (
    <>
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              Visão Mensal
            </p>
            <h1 className="mt-1 text-2xl font-semibold capitalize text-slate-950 dark:text-slate-50">
              {monthLabel}
            </h1>
          </div>
          <MonthSwitcher month={month} onChange={setSelectedDate} year={year} />
        </div>

        {isLoading ? <SummarySkeleton /> : null}

        {!isLoading && (error || !summary) ? (
          <div>
            <Alert variant="error">
              {error ?? "Resumo mensal indisponível."}
            </Alert>
            <Button
              className="mt-4"
              onClick={() => setRefreshKey((current) => current + 1)}
              type="button"
            >
              Tentar novamente
            </Button>
          </div>
        ) : null}

        {!isLoading && summary ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              className="md:col-span-2 xl:col-span-4"
              hint="Saldo livre no mês."
              icon={<PiggyBank aria-hidden="true" size={48} />}
              label="Total Geral Disponível"
              tone="balance"
              value={summary.total_geral_disponivel}
            />

            <SummaryCard
              className="xl:col-span-2"
              icon={<TrendingUp aria-hidden="true" size={34} />}
              label="Total Recebido"
              tone="income"
              value={summary.total_income}
            />
            <SummaryCard
              className="xl:col-span-2"
              icon={<Wallet aria-hidden="true" size={34} />}
              label="Total Gasto"
              tone="expense"
              value={summary.total_expense}
            />

            <SummaryCard
              action={
                <IncomeActions
                  amount={summary.salario}
                  month={month}
                  onOpen={setIncomeShortcut}
                  source="Salario"
                  year={year}
                />
              }
              label="Salário"
              tone="source"
              value={summary.salario}
            />
            <SummaryCard
              action={
                <IncomeActions
                  amount={summary.adiantamento}
                  month={month}
                  onOpen={setIncomeShortcut}
                  source="Adiantamento"
                  year={year}
                />
              }
              label="Adiantamento"
              tone="source"
              value={summary.adiantamento}
            />

            <SummaryCard
              action={
                <IncomeActions
                  amount={summary.renda_extra_amt}
                  month={month}
                  onOpen={setIncomeShortcut}
                  source="Renda Extra"
                  year={year}
                />
              }
              className="md:col-span-2"
              icon={<BarChart3 aria-hidden="true" size={38} />}
              label="Renda Extra (Disponível)"
              tone="extra"
              value={summary.restante_renda_extra}
            />

            <SummaryCard
              label="Restante Salário"
              tone="remaining"
              value={summary.restante_salario}
            />
            <SummaryCard
              label="Restante Adiant."
              tone="remaining"
              value={summary.restante_adiantamento}
            />

            <SummaryCard
              icon={<ReceiptText aria-hidden="true" size={30} />}
              label="Gasto Salário"
              tone="spent"
              value={gastoSalario}
            />
            <SummaryCard
              icon={<ReceiptText aria-hidden="true" size={30} />}
              label="Gasto Adiant."
              tone="spent"
              value={gastoAdiantamento}
            />
          </div>
        ) : null}
      </section>

      <IncomeShortcutDialog
        onClose={() => setIncomeShortcut(null)}
        onSuccess={() => {
          setIncomeShortcut(null);
          setRefreshKey((current) => current + 1);
        }}
        shortcut={incomeShortcut}
      />
    </>
  );
}
