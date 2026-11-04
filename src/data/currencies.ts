import type { Currency } from "../interfaces/spec";

export const CURRENCY_OPTIONS: { value: Currency; label: string }[] = [
  { value: "CAD", label: "CAD ($) · Dollar canadien" },
  { value: "USD", label: "USD ($) · Dollar américain" },
  { value: "EUR", label: "EUR (€) · Euro" },
];