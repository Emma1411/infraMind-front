const NUMBER = new Intl.NumberFormat("fr-CA");

export function formatNumber(value: number): string {
  return NUMBER.format(value);
}