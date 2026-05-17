const moneyFormatter = new Intl.NumberFormat("pt-BR", {
  currency: "BRL",
  style: "currency",
});

const percentageFormatter = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 1,
  minimumFractionDigits: 0,
});

export function formatMoney(value: number | null | undefined) {
  return moneyFormatter.format(value ?? 0);
}

export function formatPercentage(value: number | null | undefined) {
  return `${percentageFormatter.format(value ?? 0)}%`;
}

export function formatAmountInput(value: number | null | undefined) {
  if (!value) {
    return "";
  }

  return String(value).replace(".", ",");
}

export function parseAmountInput(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return Number.NaN;
  }

  if (trimmed.includes(",")) {
    return Number(trimmed.replace(/\./g, "").replace(",", "."));
  }

  return Number(trimmed);
}
