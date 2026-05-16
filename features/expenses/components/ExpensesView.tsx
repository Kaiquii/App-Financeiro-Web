"use client";

import {
  CalendarDays,
  FileText,
  Pencil,
  Plus,
  ReceiptText,
  Search,
  Trash2,
  WalletCards,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  getCurrentMonthReference,
  MonthSwitcher,
} from "@/components/ui/month-switcher";
import { ExpenseDeleteDialog } from "@/features/expenses/components/ExpenseDeleteDialog";
import {
  ExpenseFormDialog,
  type ExpenseFormMode,
} from "@/features/expenses/components/ExpenseFormDialog";
import { useExpenseStore } from "@/features/expenses/store/useExpenseStore";
import type {
  Category,
  Expense,
  ExpenseTypeFilter,
} from "@/features/expenses/types/expense";
import { cn } from "@/lib/utils";

const moneyFormatter = new Intl.NumberFormat("pt-BR", {
  currency: "BRL",
  style: "currency",
});

const typeFilters: ExpenseTypeFilter[] = ["Todas", "Parceladas", "\u00danicas", "Fixas"];

function formatMoney(value: number) {
  return moneyFormatter.format(value);
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function matchesTypeFilter(expense: Expense, filter: ExpenseTypeFilter) {
  const type = normalizeText(expense.type);

  if (filter === "Todas") {
    return true;
  }

  if (filter === "Parceladas") {
    return type === "parcelada";
  }

  if (filter === "Fixas") {
    return type === "fixa";
  }

  return type === "unica";
}

function getCategoryName(expense: Expense, categoriesById: Map<number, string>) {
  if (expense.category) {
    return expense.category;
  }

  if (typeof expense.category_id === "number") {
    return categoriesById.get(expense.category_id) ?? "Sem categoria";
  }

  return "Sem categoria";
}

function formatExpenseDate(date: string) {
  const inputDate = date.includes("T") ? date.split("T")[0] : date;
  const [year, month, day] = inputDate.split("-");

  if (!year || !month || !day) {
    return "--/--";
  }

  return `${day}/${month}`;
}

function getPaymentSourceLabel(source: string) {
  const normalized = normalizeText(source);

  if (normalized.includes("adiantamento")) {
    return "Adiantamento";
  }

  if (normalized.includes("renda extra")) {
    return "Renda Extra";
  }

  return "Sal\u00e1rio";
}

function getInstallmentLabel(expense: Expense) {
  if (normalizeText(expense.type) !== "parcelada") {
    return null;
  }

  const current = expense.current_installment ?? 1;

  return `${current}/${expense.installments}`;
}

function getCategoriesMap(categories: Category[]) {
  return new Map(categories.map((category) => [category.id, category.name]));
}

type ExpenseCardProps = {
  categoryName: string;
  expense: Expense;
  onDelete: (expense: Expense) => void;
  onEdit: (expense: Expense) => void;
};

function ExpenseCard({ categoryName, expense, onDelete, onEdit }: ExpenseCardProps) {
  const installmentLabel = getInstallmentLabel(expense);

  return (
    <article className="grid gap-4 rounded-[1.35rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700/45 dark:bg-slate-800/75 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-5">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-950/65 dark:text-blue-400">
        <ReceiptText aria-hidden="true" size={28} />
      </div>

      <div className="min-w-0">
        <h2 className="truncate text-lg font-semibold text-slate-950 dark:text-white">
          {expense.description}
        </h2>
        <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
          {categoryName}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700/65 dark:text-slate-300">
            {expense.type}
          </span>
          {installmentLabel ? (
            <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
              {installmentLabel}
            </span>
          ) : null}
          <span>• {formatExpenseDate(expense.date)}</span>
        </div>
      </div>

      <div className="flex items-end justify-between gap-4 sm:flex-col sm:items-end">
        <div className="flex items-center gap-1">
          <button
            aria-label={`Editar ${expense.description}`}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-blue-500 hover:bg-blue-500/10 hover:text-blue-400"
            onClick={() => onEdit(expense)}
            title="Editar"
            type="button"
          >
            <Pencil aria-hidden="true" size={18} strokeWidth={2.4} />
          </button>
          <button
            aria-label={`Excluir ${expense.description}`}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-red-400 hover:bg-red-500/10 hover:text-red-300"
            onClick={() => onDelete(expense)}
            title="Excluir"
            type="button"
          >
            <Trash2 aria-hidden="true" size={18} strokeWidth={2.4} />
          </button>
        </div>

        <div className="text-right">
          <strong className="text-xl font-semibold text-slate-950 dark:text-white">
            - {formatMoney(expense.amount)}
          </strong>
          <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-300">
            <WalletCards aria-hidden="true" className="text-blue-500" size={16} />
            {getPaymentSourceLabel(expense.payment_source)}
          </p>
        </div>
      </div>
    </article>
  );
}

function ExpensesSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          className="h-36 animate-pulse rounded-[1.35rem] border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
          key={index}
        />
      ))}
    </div>
  );
}

export function ExpensesView() {
  const [{ month, year }, setSelectedDate] = useState(getCurrentMonthReference);
  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null);
  const [formExpense, setFormExpense] = useState<Expense | null>(null);
  const [formMode, setFormMode] = useState<ExpenseFormMode | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<ExpenseTypeFilter>("Todas");

  const categories = useExpenseStore((state) => state.categories);
  const error = useExpenseStore((state) => state.error);
  const expenses = useExpenseStore((state) => state.expenses);
  const isLoading = useExpenseStore((state) => state.isLoading);
  const loadInitialData = useExpenseStore((state) => state.loadInitialData);
  const message = useExpenseStore((state) => state.message);

  useEffect(() => {
    void loadInitialData(month, year);
  }, [loadInitialData, month, year]);

  const categoriesById = useMemo(() => getCategoriesMap(categories), [categories]);
  const filteredExpenses = useMemo(() => {
    const search = normalizeText(searchQuery);

    return expenses.filter((expense) => {
      const matchesSearch = normalizeText(expense.description).includes(search);
      const matchesType = matchesTypeFilter(expense, typeFilter);

      return matchesSearch && matchesType;
    });
  }, [expenses, searchQuery, typeFilter]);

  const totalAmount = filteredExpenses.reduce(
    (total, expense) => total + expense.amount,
    0,
  );

  function openCreateDialog() {
    setFormExpense(null);
    setFormMode("create");
  }

  function openEditDialog(expense: Expense) {
    setFormExpense(expense);
    setFormMode("edit");
  }

  function closeFormDialog() {
    setFormExpense(null);
    setFormMode(null);
  }

  function refreshExpenses() {
    closeFormDialog();
    setDeleteTarget(null);
    void loadInitialData(month, year);
  }

  return (
    <>
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">
              Controle mensal
            </p>
            <h1 className="mt-1 text-3xl font-semibold text-slate-950 dark:text-slate-50">
              Despesas Mensais
            </h1>
          </div>
          <Button
            className="hidden rounded-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:text-slate-950 dark:hover:bg-blue-400 sm:inline-flex"
            onClick={openCreateDialog}
            type="button"
          >
            <Plus aria-hidden="true" size={17} />
            Nova despesa
          </Button>
        </div>

        <div className="relative">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
            size={26}
          />
          <input
            className="h-16 w-full rounded-[1.35rem] border border-slate-200 bg-white pl-14 pr-5 text-base text-slate-950 shadow-sm outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700/45 dark:bg-slate-800/75 dark:text-white dark:placeholder:text-slate-400 dark:focus:border-blue-500 dark:focus:ring-blue-950/50 sm:text-lg"
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Buscar despesa..."
            value={searchQuery}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {typeFilters.map((filter) => (
            <button
              className={cn(
                "shrink-0 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-500 hover:bg-slate-100 dark:bg-slate-800/75 dark:text-slate-400 dark:hover:bg-slate-800 sm:text-base",
                typeFilter === filter &&
                  "bg-blue-600 text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700 dark:bg-blue-500 dark:text-slate-950 dark:hover:bg-blue-400",
              )}
              key={filter}
              onClick={() => setTypeFilter(filter)}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="flex justify-center">
          <MonthSwitcher
            className="border-transparent bg-transparent shadow-none dark:border-transparent dark:bg-transparent"
            month={month}
            onChange={setSelectedDate}
            year={year}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300">
              <FileText aria-hidden="true" size={22} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Exibindo
              </p>
              <strong className="text-base font-semibold text-slate-950 dark:text-slate-50">
                {filteredExpenses.length} despesas
              </strong>
            </div>
          </div>
          <div className="flex items-center gap-2 text-right">
            <CalendarDays aria-hidden="true" className="text-slate-400" size={18} />
            <strong className="text-lg font-semibold text-red-600 dark:text-red-300">
              - {formatMoney(totalAmount)}
            </strong>
          </div>
        </div>

        {error ? <Alert variant="error">{error}</Alert> : null}
        {message ? <Alert variant="success">{message}</Alert> : null}

        {isLoading ? <ExpensesSkeleton /> : null}

        {!isLoading && !filteredExpenses.length ? (
          <div className="rounded-[1.35rem] border border-slate-200 bg-white px-6 py-10 text-center dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300">
              <ReceiptText aria-hidden="true" size={28} />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-slate-950 dark:text-slate-50">
              Nenhuma despesa encontrada
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Ajuste os filtros ou cadastre uma nova despesa para este mes.
            </p>
          </div>
        ) : null}

        {!isLoading && filteredExpenses.length ? (
          <div className="space-y-4">
            {filteredExpenses.map((expense) => (
              <ExpenseCard
                categoryName={getCategoryName(expense, categoriesById)}
                expense={expense}
                key={expense.id}
                onDelete={setDeleteTarget}
                onEdit={openEditDialog}
              />
            ))}
          </div>
        ) : null}
      </section>

      <button
        aria-label="Nova despesa"
        className="fixed bottom-6 right-6 z-20 inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-950/25 hover:bg-blue-700 dark:bg-blue-500 dark:text-slate-950 dark:hover:bg-blue-400 sm:hidden"
        onClick={openCreateDialog}
        type="button"
      >
        <Plus aria-hidden="true" size={30} strokeWidth={2.4} />
      </button>

      <ExpenseFormDialog
        expense={formExpense}
        mode={formMode}
        month={month}
        onClose={closeFormDialog}
        onSuccess={refreshExpenses}
        year={year}
      />

      <ExpenseDeleteDialog
        expense={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onSuccess={refreshExpenses}
      />
    </>
  );
}
