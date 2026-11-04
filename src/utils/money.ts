export function formatMoney(value: number, currency = "USD", digits = 0): string {
  return new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatRange(low: number, high: number, currency = "USD", digits = 0): string {
  return `${formatMoney(low, currency, digits)} à ${formatMoney(high, currency, digits)}`;
}