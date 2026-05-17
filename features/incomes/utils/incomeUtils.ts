import type { Income, IncomeSource } from "@/features/incomes/types/income";

function normalizeIncomeSource(source: string): IncomeSource {
  const normalized = source
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  if (normalized.includes("adiantamento")) {
    return "Adiantamento";
  }

  if (normalized.includes("renda extra")) {
    return "Renda Extra";
  }

  return "Salario";
}

export function findIncomeByReference(
  incomes: Income[],
  source: IncomeSource,
  month: number,
  year: number,
) {
  return incomes.find(
    (income) =>
      normalizeIncomeSource(income.source) === source &&
      income.month === month &&
      income.year === year,
  );
}
